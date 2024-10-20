// pages/api/fetch-payment-pointer.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Adjust the path based on your Prisma setup

interface ApiResponse {
  paymentPointer: string | null;
  message?: string;
  error?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
        message: `Method ${req.method} Not Allowed`,
        paymentPointer: null
    });
  }

  const { username } = req.body;

  // Validate the presence of username
  if (!username || typeof username !== 'string') {
    return res.status(400).json({
        message: 'Username is required and must be a string.',
        paymentPointer: null
    });
  }

  try {
    // Fetch the user by email (assuming username is email)
    const user = await prisma.user.findUnique({
      where: { email: username },
      select: { paymentPointer: true },
    });

    if (!user) {
      return res.status(404).json({
          message: 'User not found.',
          paymentPointer: null
      });
    }

    res.status(200).json({ paymentPointer: user.paymentPointer });
  } catch (error) {
    console.error('Error fetching payment pointer:', error);
    res.status(500).json({
        message: 'Error fetching payment pointer.', error,
        paymentPointer: null
    });
  }
}
