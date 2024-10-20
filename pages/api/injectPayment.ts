import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { projectID, amount, timeStamp, hash, interact_ref } = req.body;

    // Validate required parameters
    if (!projectID || !amount || !timeStamp || !hash || !interact_ref) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
      // Convert amount to float
      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat)) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Insert data into the Tip model
      const tip = await prisma.tip.create({
        data: {
          projectId: parseInt(projectID),
          amount: amountFloat,
          timeStamp: timeStamp as string,
          hash: hash as string,
          interactRef: interact_ref as string,
        },
      });

      // Redirect to thank you page after successful payment
      return res.status(200).json({ message: 'Payment processed successfully', tip });
    } catch (error) {
      // Handle unique constraint violation on hash
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(409).json({
          error: 'Duplicate hash: A payment with this hash already exists.',
        });
      }
      
      // Catch any other unexpected errors
      console.error('Error inserting payment:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
