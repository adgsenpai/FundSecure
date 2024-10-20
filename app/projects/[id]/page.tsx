"use client";

import MarkdownIt from "markdown-it";
import { notFound } from "next/navigation";
import PaymentButton from "@/components/shared/PaymentButton";
import ClientSideButtons from "./ClientSideButtons";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const mdParser = new MarkdownIt();

// Fetch project data
function getProject(id: number) {
  return fetch(`/api/projects/${id}`)
    .then((res) => {
      if (!res.ok) {
        return null;
      }
      return res.json();
    })
    .catch(() => null);
}

// Fetch tips stats (total donations for the project)
async function fetchTipsStats(projectId: number) {
  const res = await fetch(`/api/tips/stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  });

  const data = await res.json();
  return data.totalAmount || 0;
}

// Fetch list of tips/donations for the project
async function fetchTipsList(projectId: number) {
  const res = await fetch(`/api/tips/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  });

  const data = await res.json();
  return data.tips || [];
}

// Loading Skeleton Component
function ProjectPageSkeleton() {
  return (
    <div className="container mx-auto px-5 py-10 animate-pulse">
      {/* Banner Image Skeleton */}
      <div className="w-full h-64 bg-gray-300 rounded-lg mb-4"></div>

      {/* Title Skeleton */}
      <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto mb-8"></div>

      {/* Project Details Skeleton */}
      <div className="text-center mb-8">
        <div className="h-6 bg-gray-300 rounded w-1/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
      </div>

      {/* Author Details Skeleton */}
      <div className="text-center mb-8">
        <div className="inline-block w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
      </div>

      {/* Payment Button Skeleton */}
      <div className="flex justify-center mb-8">
        <div className="h-12 bg-gray-300 rounded w-32"></div>
      </div>

      {/* Markdown Content Skeleton */}
      <div className="prose max-w-none mb-10">
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/4"></div>
        </div>
      </div>

      {/* Client Side Buttons Skeleton */}
      <div className="flex justify-center space-x-4">
        <div className="h-10 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  );
}

export default function ProjectPage({ params }: { params: { id: number } }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalTips, setTotalTips] = useState(0); // Total tips received
  const [tipsList, setTipsList] = useState<any[]>([]); // List of tips
  const [goalReached, setGoalReached] = useState(false);

  // Fetch project data and tips stats
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProject(params.id);
      if (!data) {
        notFound();
        return;
      }
      setProject(data);

      // Fetch the total amount of tips (donations) for the project
      const tipsTotal = await fetchTipsStats(params.id);
      setTotalTips(tipsTotal);

      // Fetch the list of tips/donations for the project
      const tips = await fetchTipsList(params.id);
      setTipsList(tips);

      const goal = parseFloat(data.goal);
      if (tipsTotal >= goal) {
        setGoalReached(true);
        confetti({
          particleCount: 150,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return <ProjectPageSkeleton />;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  // Calculate progress as a percentage
  const goal = parseFloat(project.goal);
  const progressPercentage = Math.min((totalTips / goal) * 100, 100); // Cap at 100%

  return (
    <div className="container mx-auto px-5 py-10">
      {/* Banner Image */}
      {project.bannerImage ? (
        <img
          src={project.bannerImage}
          alt={`${project.title} banner`}
          className="w-full h-auto rounded-lg mb-4"
        />
      ) : (
        <img
          src="/default-banner.webp"
          alt="Default banner"
          className="w-full h-auto rounded-lg mb-4"
        />
      )}

      {/* Project Title */}
      <h1 className="text-4xl font-bold text-center mb-8">{project.title}</h1>

      {/* Project Details */}
      <div className="text-center mb-8">
        <p className="text-2xl font-semibold">Goal: ZAR {project.goal}</p>
        <p className="text-gray-600">
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
        <div
          className={`h-6 rounded-full ${
            goalReached ? "bg-green-600" : "bg-blue-600"
          }`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-center">
        Raised ZAR {totalTips} of ZAR{goal} ({progressPercentage.toFixed(2)}%)
      </p>

      {/* Confetti and Message for Goal Completion */}
      {goalReached && (
        <div className="text-center text-green-600 font-bold mt-4">
          🎉 Goal Completed! Thank you for your generosity! 🎉
        </div>
      )}

      {/* Author Details */}
      {project.user && (
        <div className="text-center mb-8">
          <img
            src={project.user.image || "/default-avatar.png"}
            alt={project.user.name}
            className="inline-block w-16 h-16 rounded-full mb-2"
          />
          <p className="text-xl font-semibold">{project.user.name}</p>
          <p className="text-sm text-gray-600">
            Created on: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Payment Button */}
      <div className="flex justify-center mb-8">
        <PaymentButton project={project} />
      </div>

      {/* Markdown Content */}
      <div className="prose max-w-none mb-10">
        <div
          dangerouslySetInnerHTML={{
            __html: mdParser.render(project.markDownCode),
          }}
        />
      </div>

      {/* Tips Table */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        {tipsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Hash</th>
                  {/* Add more columns if needed */}
                </tr>
              </thead>
              <tbody>
                {tipsList.map((tip) => (
                  <tr key={tip.id} className="border-t">
                    <td className="px-4 py-2">
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">ZAR {tip.amount}</td>
                    <td className="px-4 py-2">{tip.hash}</td>
                    {/* Add more cells if needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>

      <ClientSideButtons projectUserEmail={project.user.email} projectid={project.id} />
    </div>
  );
}
