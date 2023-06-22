import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";
import { serverAuth } from "@/lib/serverAuth";
import { db } from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const { currentUser } = await serverAuth(req, res);

            const { movieId } = req.body;

            const existingMovie = await db.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            const user = await db.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: {
                        push: movieId
                    }
                }
            });

            return res.status(200).json(user);
        }

        if (req.method === 'DELETE') {
            const { currentUser } = await serverAuth(req, res);

            const { movieId } = req.body;

            const existingMovie = await db.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

            const updatedUser = await db.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: updatedFavoriteIds,
                }
            });

            return res.status(200).json(updatedUser);
        }

        return res.status(405).end();
    } catch (error) {
        console.log(error);

        return res.status(500).end();
    }
}