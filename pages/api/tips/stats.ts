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
      // Get the total amount of tips for the project
      const totalTips = await prisma.tip.aggregate({
        where: { projectId: parseInt(projectId) },
        _sum: {
          amount: true,
        },
      });

      return res.status(200).json({ totalAmount: totalTips._sum.amount || 0 });
    } catch (error) {
      console.error("Error fetching tips stats:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
