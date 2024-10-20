// pages/api/tips/list.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { projectId } = req.body;

    // Validate required parameter
    if (!projectId) {
      return res.status(400).json({ error: "Missing projectId" });
    }

    try {
      // Get the list of tips for the project
      const tips = await prisma.tip.findMany({
        where: { projectId: parseInt(projectId) },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({ tips });
    } catch (error) {
      console.error("Error fetching tips list:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
