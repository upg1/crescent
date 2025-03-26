import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signIn } from "next-auth/react";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Demo login route that uses Next.js Edge Runtime
export const runtime = 'edge';

// This is a simple demo login endpoint for testing purposes
// WARNING: Do not use in production without proper security
export async function GET(request) {
  try {
    // Check if already logged in
    const session = await getServerSession(authOptions);
    if (session) {
      // Already logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Extract role parameter from URL
    const url = new URL(request.url);
    const role = url.searchParams.get('role')?.toUpperCase() || 'STAFF';
    const demoKey = url.searchParams.get('key');
    
    // For security, require a demo key that matches an environment variable
    // This helps prevent unauthorized access to the demo
    if (!demoKey || demoKey !== process.env.NEXT_PUBLIC_DEMO_KEY) {
      return NextResponse.redirect(new URL('/auth/signin?error=AccessDenied', request.url));
    }
    
    // Map roles to actual email accounts in the system
    const roleToEmail = {
      'STAFF': 'staff@school.org',
      'TEACHER': 'math.teacher@school.org',
      'STUDENT': 'sophia.garcia@school.org',
      'PARENT': 'parent@example.com',
      'ADMIN': 'admin@example.com'
    };
    
    // Get email for requested role
    const email = roleToEmail[role] || roleToEmail.STAFF;
    
    // Instead of manually creating a session, redirect to signin page with prefilled values
    // This uses the standard authentication flow but automates it
    const callbackUrl = url.searchParams.get('callbackUrl') || '/dashboard';
    const signinUrl = `/auth/signin?email=${encodeURIComponent(email)}&password=test123&demo=true&callbackUrl=${encodeURIComponent(callbackUrl)}`;
    
    return NextResponse.redirect(new URL(signinUrl, request.url));
    
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.redirect(new URL('/auth/signin?error=InternalError', request.url));
  }
}