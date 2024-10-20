// app/projects/[id]/ClientSideButtons.tsx
'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRouter } from 'next/navigation';

interface ClientSideButtonsProps {
  projectUserEmail: string;
  projectid: number; // Ensure this matches the type of your project ID
}

const MySwal = withReactContent(Swal);

export default function ClientSideButtons({ projectUserEmail, projectid }: ClientSideButtonsProps) {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  // Fetch user session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setUsername(data.user.email);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSession();
  }, []);

  // If the current user is not the project owner, do not render buttons
  if (username !== projectUserEmail) {
    return null;
  }

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this project? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/projects/${projectid}`, {
          method: 'POST', // Using POST as per API route
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }), // Send username in the request body
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete the project.');
        }

        await MySwal.fire('Deleted!', 'Your project has been deleted.', 'success');

        // Redirect to projects list or homepage after deletion
        router.push('/'); // Adjust the path as needed
      } catch (error: any) {
        console.error('Deletion error:', error);
        await MySwal.fire('Error!', error.message || 'There was an error deleting your project.', 'error');
      }
    }
  };

  return (
    <div className="flex space-x-4 mb-8">
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete
      </button>
    </div>
  );
}
