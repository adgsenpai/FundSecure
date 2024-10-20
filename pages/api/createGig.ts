import { NextApiRequest, NextApiResponse } from 'next';
// Remove getSession import since we're not using it
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '150mb', 
      },
    },
  };

export default async function createGig(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Method Not Allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Extract the form data from the request body, including username
  const { username, title, description, bannerImage, markDownCode, goal, deadline } = req.body;
  console.log(username, title, description, markDownCode, goal, deadline);

  // Validate required fields
  if (!username || !title || !markDownCode || !goal || !deadline) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: {
      email: username,
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  try {
    // Create the project
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title,
        description,
        bannerImage,
        markDownCode,
        goal,
        deadline,
      },
    });
        
    // Return success response
    return res.status(200).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
