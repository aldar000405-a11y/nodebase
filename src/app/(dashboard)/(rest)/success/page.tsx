"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upgrade Successful! 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for upgrading to Pro! Your account now has access to all premium features.
        </p>

        <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
          <p className="text-sm text-gray-600 mb-2">Checkout ID:</p>
          <p className="font-mono text-sm text-green-700 break-all">
            {checkoutId || "Processing..."}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/workflows"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Workflows
          </Link>
          <Link
            href="/credentials"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Setup Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
