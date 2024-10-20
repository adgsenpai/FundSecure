'use client'; // Ensure this is marked as a client component
import { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2 or any spinner library

interface PaymentButtonProps {
  project: {
    id: number;
    goal: number;
    user?: {
      paymentPointer?: string;
    };
  } | null;
}

export default function PaymentButton({ project }: PaymentButtonProps) {
  const [amount, setAmount] = useState<number | string>(''); 
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Show the SweetAlert spinner
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while your payment is being processed.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      
      // Assuming your API is hosted on localhost:8000
      const response = await fetch('http://localhost:8000/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //@ts-ignore
          sendingWalletAddress: project?.user?.paymentPointer.replace('$', 'https://'),
          amount: amount,
          projectID: project?.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Close SweetAlert spinner and redirect
        Swal.close();
        window.location.href = result.interactRedirect;
      } else {
        Swal.fire('Error', result.error || 'An error occurred', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to initiate payment. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!project) {
    return <p>Loading project data...</p>;
  }

  return (
    <div className="payment-section">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Enter an amount up to ${project.goal}`}
        className="border p-2 rounded mb-4 w-full"
        disabled={isLoading}
      />
      <button
        onClick={handlePayment}
        disabled={isLoading || !project || !amount}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        {isLoading ? 'Processing...' : 'Support This Project'}
      </button>
    </div>
  );
}
