import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
const { PrismaClient } = require('@prisma/client')

// Initialize Prisma client
let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { title, content, tags, type, relatedNotes } = await request.json()

    if (!title.trim() || !content.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Handle tags - if it's an array, use it directly; if it's a string, split it
    const processedTags = Array.isArray(tags) 
      ? tags 
      : tags.split(',').map(tag => tag.trim()).filter(tag => tag)

    // Update the note
    const note = await prisma.note.update({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        title,
        content,
        tags: processedTags,
        type
      },
    })

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Update related notes
    if (relatedNotes) {
      await prisma.note.update({
        where: { id: note.id },
        data: {
          relatedNotes: {
            set: relatedNotes.map(id => ({ id }))
          }
        }
      })
    }

    // Fetch the note with related notes included
    const noteWithRelations = await prisma.note.findUnique({
      where: { id: note.id },
      include: {
        relatedNotes: true
      }
    })

    return NextResponse.json(noteWithRelations)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}
