import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, name, password, role } = body

    console.log('Registration request:', { email, name, role })

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Validate role is one of the enum values
    const validRoles = ['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']
    const userRole = role && validRoles.includes(role.toUpperCase()) 
      ? role.toUpperCase() 
      : 'STUDENT'

    // Create new user
    const userData = {
      email,
      name: name || email.split('@')[0], // Use part of email as name if not provided
      password: hashedPassword,
      role: userRole,
    }

    console.log('Creating user with data:', userData)

    const user = await prisma.user.create({
      data: userData,
    })

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'An error occurred during registration', error: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}