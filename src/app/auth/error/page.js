'use client'

import { useRouter } from 'next/navigation'

export default function AuthError() {
  const router = useRouter()
  const error = window.location.search.split('error=')[1]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            {error ? decodeURIComponent(error) : 'An error occurred during authentication'}
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push('/auth/signin')}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try signing in again
          </button>
        </div>
      </div>
    </div>
  )
}
