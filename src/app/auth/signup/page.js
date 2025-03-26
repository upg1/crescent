'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during sign-up')
      }

      // Get the callbackUrl from the query parameters
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')
      router.push(callbackUrl || '/auth/signin')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message || 'An error occurred during sign-up')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="student-role"
                  name="role"
                  type="radio"
                  value="STUDENT"
                  checked={role === 'STUDENT'}
                  onChange={() => setRole('STUDENT')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="student-role" className="ml-2 block text-sm text-gray-900">
                  Student
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="parent-role"
                  name="role"
                  type="radio"
                  value="PARENT"
                  checked={role === 'PARENT'}
                  onChange={() => setRole('PARENT')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="parent-role" className="ml-2 block text-sm text-gray-900">
                  Parent
                </label>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {role === 'PARENT' ? 'As a parent, you can manage your scholars\' accounts and learning progress.' : 'As a student, you can access courses and track your learning progress.'}
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        <div className="mt-6">
          <button
            onClick={() => router.push('/auth/signin')}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
