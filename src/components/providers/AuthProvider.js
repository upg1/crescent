'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const handleSignIn = async (email, password) => {
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        throw new Error(res.error)
      }
      
      return res
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
