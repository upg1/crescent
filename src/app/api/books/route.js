import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        chapters: true
      }
    })
    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const book = await prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        courseId: data.courseId || null
      }
    })
    return NextResponse.json(book)
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}
