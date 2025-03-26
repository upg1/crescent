import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        books: true
      },
      orderBy: {
        title: 'asc'
      }
    })

    // Transform the data to match our frontend structure
    const transformedCourses = courses.map(course => ({
      id: course.slug,
      title: course.title,
      description: course.description,
      level: course.books[0]?.level || 'Beginner',
      lessons: course.books.reduce((total, book) => total + (book.lessons || 0), 0),
      imageUrl: `/courses/${course.slug}/cover.svg`,
      books: course.books.map(book => ({
        id: book.slug,
        title: book.title,
        description: book.description,
        slug: book.slug,
        courseId: course.slug
      }))
    }))

    return NextResponse.json(transformedCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
