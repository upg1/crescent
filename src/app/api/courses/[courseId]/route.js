import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        books: {
          orderBy: {
            title: 'asc'
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}
