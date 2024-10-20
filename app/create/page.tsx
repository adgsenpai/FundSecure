"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For navigation after post creation

export default function CreatePostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");

    // fetch user name from /api/auth/session
    const fetchSession = async () => {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        // if empty, redirect to login
        if (!data.user) {
            router.push("/");
            return;
        }
        setUsername(data.user.email);
    };

    // Fetch user session on component mount
    useEffect(() => {
        fetchSession();
    }, []);



    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Basic validation
        if (!title.trim() || !content.trim()) {
            setError("Both title and content are required.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Send POST request to API to create the post
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content, email: username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong while creating the post.");
            }

            // Reset the form fields
            setTitle("");
            setContent("");

            // Redirect to homepage or post list after successful creation
            router.push("/posts");
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="" style={{ position: 'relative' }}>
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create a New Post</h2>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h2 className="font-bold mb-4">Create a New Post</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Enter post content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={4}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        ></textarea>                        
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isSubmitting ? "Posting..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}
