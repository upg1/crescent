// src/app/autologin/page.js
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function AutoLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const username = searchParams.get('username')
    const password = searchParams.get('password')
    const redirect = searchParams.get('redirect') || '/dashboard'
    
    if (username && password) {
      signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: redirect
      })
    } else {
      router.push('/auth/signin')
    }
  }, [searchParams, router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  )
}