'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  bannerImage?: string;
  user: { name: string };
}

interface ApiResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
}

const SponsorShowcasePage = () => {
  const [projects, setProjects] = useState<Project[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const fetchProjects = async (page = 1, search = '') => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await fetch(`/api/sponsor-showcase?page=${page}&search=${search}`);
      const data: ApiResponse = await response.json();
      setProjects(data.projects || []); // Ensure projects is always an array
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]); // Set projects to an empty array on error
    } finally {
      setLoading(false); // Set loading to false after data fetch completes
    }
  };

  useEffect(() => {
    fetchProjects(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="container mx-auto px-5 py-10">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search projects..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Display "Gig not found" if there are no projects */}
      {!loading && projects && projects.length === 0 && (
        <div className="text-center text-gray-500">
          <p>Gig not found.</p>
        </div>
      )}

      {/* Project Cards or Skeleton Loader */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : projects && projects.length > 0 
          ? projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 group-hover:-translate-y-2 group-hover:shadow-xl cursor-pointer">
                  <div className="mb-4">
                    <Image
                      src={project.bannerImage || '/default-banner.webp'}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                  <p className="text-gray-600">{truncateText(project.description, 100)}</p>
                  <p className="text-sm text-gray-500 mt-2">By: {project.user.name}</p>
                </div>
              </Link>
            ))
          : null} {/* No projects to map over */}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="mt-10 flex justify-center space-x-4">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
            >
              Previous
            </button>
          )}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SponsorShowcasePage;

const SkeletonLoader = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);
