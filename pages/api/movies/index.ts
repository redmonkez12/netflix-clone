import { NextApiRequest, NextApiResponse } from "next";
import { serverAuth } from "@/lib/serverAuth";
import { db } from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        await serverAuth(req, res);

        const movies = await db.movie.findMany();

        return res.status(200).json(movies);
    } catch (error) {
        console.log({ error })
        return res.status(500).end();
    }
}