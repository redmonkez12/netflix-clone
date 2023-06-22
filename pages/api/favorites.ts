import { NextApiRequest, NextApiResponse } from "next";
import { serverAuth } from "@/lib/serverAuth";
import { db } from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        const { currentUser } = await serverAuth(req, res);

        const favoritedMovies = await db.movie.findMany({
            where: {
                id: {
                    in: currentUser?.favoriteIds,
                }
            }
        });

        return res.status(200).json(favoritedMovies);
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}