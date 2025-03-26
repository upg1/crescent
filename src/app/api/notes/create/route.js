import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
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

    // Create the note first without related notes
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: session.user.id,
        tags: processedTags,
        noteRole: 'personal',
        isParentNote: false,
        visibility: 'private',
        type
      },
    })

    // If there are related notes, connect them
    if (relatedNotes && relatedNotes.length > 0) {
      await prisma.note.update({
        where: { id: note.id },
        data: {
          relatedNotes: {
            connect: relatedNotes.map(id => ({ id }))
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
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
