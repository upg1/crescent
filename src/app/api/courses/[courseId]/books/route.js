import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const books = await prisma.book.findMany({
      where: {
        course: {
          slug: params.slug
        }
      },
      include: {
        chapters: true
      }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books for course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books for course' },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const data = await request.json()
    const course = await prisma.course.findUnique({
      where: { slug: params.slug }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        courseId: course.id
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error creating book for course:', error)
    return NextResponse.json(
      { error: 'Failed to create book for course' },
      { status: 500 }
    )
  }
}
