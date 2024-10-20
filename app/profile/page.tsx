// components/ProfileComponent.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col items-center">
    <div className="rounded-full bg-gray-300 h-24 w-24 mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-48"></div>
  </div>
);

const MySwal = withReactContent(Swal);

// Define the regex for validating payment pointer
const paymentPointerRegex = /^\$ilp\.interledger-test\.dev\/\w+$/;

const ProfileComponent = () => {
  const [paymentPointer, setPaymentPointer] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // New state for saving
  const [paymentPointerError, setPaymentPointerError] = useState(''); // New state for validation errors
  const router = useRouter();

  // Fetch session manually
  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      console.log('Session Data:', data); // Debugging

      if (!data.user) {
        router.push('/');
      } else {
        setUsername(data.user.email);
        setName(data.user.name ?? '');
        setPhoto(data.user.image ?? '');
        setIsAuthenticated(true);
        console.log('Initial Payment Pointer:', data.user.paymentPointer); // Debugging
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment pointer by username
  const fetchPaymentPointer = async (username: string) => {
    try {
      console.log('Fetching payment pointer for:', username); // Debugging
      const response = await fetch('/api/fetch-payment-pointer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      console.log('Fetch Payment Pointer Response Status:', response.status); // Debugging

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fetch Payment Pointer Error:', errorData); // Debugging
        throw new Error(errorData.message || 'Failed to fetch payment pointer.');
      }

      const data = await response.json();
      console.log('Fetched Payment Pointer:', data.paymentPointer); // Debugging
      setPaymentPointer(data.paymentPointer || '');
    } catch (error: any) {
      console.error('Error fetching payment pointer:', error);
      MySwal.fire('Error', error.message || 'Failed to fetch payment pointer.', 'error');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchSession();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (isAuthenticated && username) {
      fetchPaymentPointer(username);
    }
  }, [isAuthenticated, username]);

  // Handle input change with validation
  const handlePaymentPointerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPaymentPointer(value);

    // Validate the payment pointer
    if (!paymentPointerRegex.test(value)) {
      setPaymentPointerError(
        'Invalid format. It should be like $ilp.interledger-test.dev/testaccount'
      );
    } else {
      setPaymentPointerError('');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if there's a validation error
    if (paymentPointerError) {
      MySwal.fire('Error', 'Please correct the errors before saving.', 'error');
      return;
    }

    // Additional check in case the user tries to bypass client-side validation
    if (!paymentPointerRegex.test(paymentPointer)) {
      setPaymentPointerError(
        'Invalid format. It should be like $ilp.interledger-test.dev/testaccount'
      );
      MySwal.fire('Error', 'Payment Pointer format is invalid.', 'error');
      return;
    }

    try {
      setIsSaving(true); // Disable the save button and show spinner
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, paymentPointer }),
      });

      console.log('Update Profile Response Status:', response.status); // Debugging

      if (response.ok) {
        setIsEditing(false);
        await fetchSession(); // Refetch the session to update the displayed data
        MySwal.fire('Success', 'Payment pointer updated successfully.', 'success');
      } else {
        const errorData = await response.json();
        console.error('Update Profile Error:', errorData); // Debugging
        throw new Error(errorData.message || 'Failed to update payment pointer.');
      }
    } catch (error: any) {
      console.error('Error updating payment pointer:', error);
      await MySwal.fire('Error', error.message || 'Failed to update payment pointer.', 'error');
    } finally {
      setIsSaving(false); // Re-enable the save button
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!isAuthenticated) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex flex-col items-center">
        {photo && (
          <img
            src={photo}
            alt={`${name}'s profile photo`}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-1">{name}</h2>
        <p className="text-gray-600 mb-4">{username}</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Your Payment Pointer</h3>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <input
              type="text"
              value={paymentPointer}
              onChange={handlePaymentPointerChange}
              placeholder="$ilp.interledger-test.dev/testaccount"
              className={`w-full p-2 border rounded ${
                paymentPointerError ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {paymentPointerError && (
              <p className="text-red-500 text-sm mt-1">{paymentPointerError}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Format: $ilp.interledger-test.dev/testaccount
            </p>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className={`flex items-center bg-blue-500 text-white px-4 py-2 rounded ${
                (paymentPointerError || isSaving) && 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!!paymentPointerError || isSaving}
            >
              {isSaving && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setPaymentPointerError('');
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded"
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://wallet.interledger-test.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              How to get a Payment Pointer
            </a>
            <p className="text-gray-500 text-sm mt-2">
              Go to the{' '}
              <a
                href="https://wallet.interledger-test.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Interledger Wallet
              </a>{' '}
              and click on <strong>Account</strong>. Then select <strong>Add Payment Pointer</strong> and paste the URL provided by the tool:
              <code className="bg-gray-200 text-gray-800 px-1 rounded ml-1">
                $ilp.interledger-test.dev/testaccount
              </code>
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p>
            <strong>Payment Pointer:</strong> {paymentPointer || 'Not set'}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Payment Pointer
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
