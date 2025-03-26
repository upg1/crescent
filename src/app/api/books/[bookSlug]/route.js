import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    // Fix: properly destructure params
    const bookSlug = params.bookSlug
    
    const book = await prisma.book.findUnique({
      where: {
        slug: bookSlug
      },
      include: {
        chapters: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  }
}