import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bookSlug = searchParams.get('bookSlug');

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First get all paragraph IDs for this book
    const paragraphs = await prisma.paragraph.findMany({
      where: {
        chapter: {
          book: {
            slug: bookSlug
          }
        }
      },
      select: {
        id: true
      }
    });

    // Then get all notes for these paragraphs
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        type: 'marginalia',
        sourceType: 'paragraph',
        sourceId: {
          in: paragraphs.map(p => p.id)
        }
      },
      select: {
        id: true,
        content: true,
        sourceId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching marginalia notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marginalia notes' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { paragraphId, content, bookSlug } = await request.json();

    // Verify the paragraph exists in this book
    const paragraph = await prisma.paragraph.findFirst({
      where: {
        id: paragraphId,
        chapter: {
          book: {
            slug: bookSlug
          }
        }
      }
    });

    if (!paragraph) {
      return NextResponse.json(
        { error: 'Paragraph not found in this book' },
        { status: 404 }
      );
    }

    const existingNote = await prisma.note.findFirst({
      where: {
        userId: session.user.id,
        type: 'marginalia',
        sourceType: 'paragraph',
        sourceId: paragraphId
      }
    });

    if (existingNote) {
      const updatedNote = await prisma.note.update({
        where: {
          id: existingNote.id
        },
        data: {
          content,
          updatedAt: new Date()
        }
      });
      return NextResponse.json(updatedNote);
    } else {
      const note = await prisma.note.create({
        data: {
          userId: session.user.id,
          content,
          type: 'marginalia',
          sourceType: 'paragraph',
          sourceId: paragraphId,
          position: 'bottom',
          visibility: 'private',
          title: 'Marginalia Note',
          noteRole: 'personal'
        }
      });
      return NextResponse.json(note);
    }
  } catch (error) {
    console.error('Error creating marginalia note:', error);
    return NextResponse.json(
      { error: 'Failed to create marginalia note' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { content } = await request.json();

    const note = await prisma.note.update({
      where: {
        id,
        userId: session.user.id
      },
      data: {
        content,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating marginalia note:', error);
    return NextResponse.json(
      { error: 'Failed to update marginalia note' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    await prisma.note.delete({
      where: {
        id,
        userId: session.user.id
      }
    });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting marginalia note:', error);
    return NextResponse.json(
      { error: 'Failed to delete marginalia note' },
      { status: 500 }
    );
  }
}
