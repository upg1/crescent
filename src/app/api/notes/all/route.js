import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        relatedNotes: {
          include: {
            relatedNotes: true
          }
        }
      }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}
