import bcrypt from "bcrypt";
import { NextApiResponse, NextApiRequest } from "next";
import { db } from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        const { email, name, password } = req.body;
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(422).json({ email: "Email is taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await db.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ error: `Something went wrong: ${error}` });
    }
}
