// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";

type Data =
  | {
      [key: string]: User | null;
    }
  | { [key: string]: string }
  | null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prisma = new PrismaClient();
  const { name } = req.query;

  if (name) {
    const user = await prisma.user.findUnique({
      where: { name: name as string },
    });

    res.status(200).json(user ? { [user.id]: user } : null);
    prisma.$disconnect;
    return;
  }

  prisma.$disconnect;
  res.status(200).json(null);
}
