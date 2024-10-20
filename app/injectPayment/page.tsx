"use client"; // Make sure to add this to enable client-side functionality in Next.js 13+

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const InjectPaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface IInjectPayment {
    projectID: string;
    amount: string;
    timeStamp: string;
    hash: string;
    interact_ref: string;
  }

  // Extract query parameters from window.location.search
  const getQueryParams = (): IInjectPayment | null => {
    const searchParams = new URLSearchParams(window.location.search);
    const projectID = searchParams.get("projectID");
    const amount = searchParams.get("amount");
    const timeStamp = searchParams.get("timeStamp");
    const hash = searchParams.get("hash");
    const interact_ref = searchParams.get("interact_ref");

    if (!projectID || !amount || !timeStamp || !hash || !interact_ref) {
      return null;
    }

    return { projectID, amount, timeStamp, hash, interact_ref };
  };

  useEffect(() => {
    const queryParams = getQueryParams();



    // Validate that all the parameters are available
    if (!queryParams) {
      setError("Missing required parameters.");
      setLoading(false);
      return;
    }

    const { projectID, amount, timeStamp, hash, interact_ref } = queryParams;

    // Send a POST request to `/api/injectPayment`
    const injectPayment = async () => {
      try {
        const response = await fetch("/api/injectPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectID,
            amount,
            timeStamp,
            hash,
            interact_ref,
          }),
        });

        if (response.ok) {
          window.location.href = "/thankyou"; // Redirect to thank you page
        } else {
          const data = await response.json();
          setError(data.error || "An error occurred while processing the payment.");
          setLoading(false);
        }
      } catch (error) {
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    };

    injectPayment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">        
        <div className="text-xl font-bold">Processing your payment...</div>        
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-lg text-gray-700">{error}</p>
          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors mt-4"
            onClick={() => window.location.href = "/"}
          >
            🔙 Go Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return null; // Once redirected to thank you page, nothing to render here
};

export default InjectPaymentPage;
