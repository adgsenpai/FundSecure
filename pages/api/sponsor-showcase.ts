// pages/api/sponsor-showcase.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Adjust the path based on your Prisma setup

interface Project {
  id: number;
  title: string;
  description: string;
  bannerImage?: string;
  user: { name: string; email: string };
}

interface ApiResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  message?: string;
  error?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { message: string; error?: any }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { page = '1', limit = '10', search = '', username } = req.query;

  const pageNumber = parseInt(page as string, 10) || 1;
  const pageSize = parseInt(limit as string, 10) || 10;
  const searchTerm = search.toString().trim();
  const filterUsername = username ? username.toString().trim() : null;

  try {
    // Build the where clause
    const whereClause: any = {};

    if (searchTerm) {
      whereClause.title = {
        contains: searchTerm,        
      };
    }

    if (filterUsername) {
      whereClause.user = {
        email: filterUsername,
      };
    }

    // Fetch projects based on the search, username, and pagination criteria
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: { user: { select: { name: true, email: true } } }, // Include user details
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }, // Optional: Order projects by creation date
    });

    // Count the total number of projects for pagination
    const totalProjects = await prisma.project.count({
      where: whereClause,
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProjects / pageSize);

    // Return the paginated projects and total pages count
    res.status(200).json({
        //@ts-ignore
      projects,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error('Error fetching projects:', error); // Log error
    res.status(500).json({ message: 'Error fetching projects', error });
  }
}
