import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        noteRole: 'marginal',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { content, tags } = await request.json()

    if (!content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        title: 'Quick Note',
        content,
        userId: session.user.id,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        noteRole: 'personal',
        isParentNote: false,
        visibility: 'private',
        type: 'fleeting', // Quick notes are typically fleeting notes
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    
    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
