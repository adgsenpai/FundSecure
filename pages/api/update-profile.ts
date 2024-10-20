import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const prisma = new PrismaClient();
  if (req.method === 'POST') {
    const { username, paymentPointer } = req.body;

    if (!username || !paymentPointer) {
      return res.status(400).json({ error: 'Username and Payment Pointer are required.' });
    }

    try {
      // Update user profile based on the username (email)
        const updatedUser = await prisma.user.update({
            where: { email: username },
            data: { paymentPointer },
        });
        
    console.log(updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
