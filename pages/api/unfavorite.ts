import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/react";
import { without } from "lodash";
import { db } from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).end();
        }

        const session = await getSession({ req });

        if (!session?.user?.email) {
            throw new Error('Not signed in');
        }

        const { movieId } = req.body;

        const existingMovie = await db.movie.findUnique({
            where: {
                id: movieId,
            }
        });

        if (!existingMovie) {
            throw new Error('Invalid ID');
        }

        const user = await db.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            throw new Error('Invalid email');
        }

        const updatedFavoriteIds = without(user.favoriteIds, movieId);

        const updatedUser = await db.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                favoriteIds: updatedFavoriteIds,
            }
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);

        return res.status(500).end();
    }
}