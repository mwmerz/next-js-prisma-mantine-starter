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

  if (req.method === "POST") {
    if (req.body.name) {
      const user = await prisma.user.findUnique({
        where: {
          name: req.body.name,
        },
      });

      if (user) {
        res.status(409).json({ error: "user already exists" });
      } else {
        const user = await prisma.user.create({
          data: { name: req.body.name },
        });
        prisma.$disconnect;
        res.status(200).json(user);
      }
    } else {
      prisma.$disconnect;
      res.status(409).json(null);
    }
  } else if (req.method === "DELETE") {
    if (req.body.uuid.length === 0) {
      return;
    }
    try {
      const result = await prisma.user.delete({
        where: {
          id: req.body.uuid,
        },
      });
      prisma.$disconnect;
      if (result) {
        res.status(204).json({ success: `Deleted ${req.body.uuid}` });
      } else {
        res.status(409);
      }
    } catch (error) {
      res.status(409);
    }
  } else if (req.method === "GET") {
    const users = await prisma.user.findMany();
    let userMap: { [key: string]: User } = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });
    prisma.$disconnect;
    res.status(200).json(users ? userMap : null);
  } else {
    prisma.$disconnect;
    res.status(200).json(null);
  }
}
