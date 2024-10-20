"use client"; // Make sure to add this to enable client-side functionality in Next.js 13+

import { useEffect } from "react";
import confetti from "canvas-confetti";

const ThankYouPage = () => {
  useEffect(() => {
    // Launch confetti when the page loads
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎉 Thank You for Your Contribution! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          🙏 Your support means a lot to us and helps us achieve our goals.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          💖 We deeply appreciate your generosity!
        </p>

        <button
          className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors"
          onClick={() => window.location.href = "/"}
        >
          🔙 Go Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
