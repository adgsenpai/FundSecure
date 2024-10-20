// pages/api/projects/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Adjust this path based on your Prisma setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate the project ID
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid project ID.' });
  }

  const projectId = Number(id);

  if (isNaN(projectId)) {
    return res.status(400).json({ message: 'Project ID must be a number.' });
  }

  if (req.method === 'GET') {
    // Existing GET handler to fetch project details
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true }, // Include user information in the project details
      });

      console.log(project);

      if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Error fetching project data.', error });
    }
  } else if (req.method === 'POST') {
    // POST handler to delete a project
    const { username } = req.body;

    // Validate the presence of username in the request body
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Username is required and must be a string.' });
    }

    try {
      // Fetch the project to verify its existence and ownership
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
      }

      // Check if the provided username matches the project's owner
      if (project.user.email !== username) { // Adjust field name as per your Prisma schema
        return res.status(403).json({ message: 'Forbidden. You do not own this project.' });
      }

      // Proceed to delete the project
      await prisma.project.delete({
        where: { id: projectId },
      });

      res.status(200).json({ message: 'Project deleted successfully.' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Error deleting the project.', error });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
