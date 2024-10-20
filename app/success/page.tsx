// pages/success.tsx
export default function SuccessPage() {
  return (
    <div className="container mx-auto px-5 py-10 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Thank You!</h1>
      <p className="text-lg">Your payment was successfully processed.</p>
      <p className="text-lg mt-4">We appreciate your support for this project!</p>
      <div className="mt-8">
        <a href="/" className="text-blue-500 underline">Return to Homepage</a>
      </div>
    </div>
  );
}