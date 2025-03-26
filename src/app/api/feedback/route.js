import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only allow parents to submit feedback
    if (session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Only parents can submit feedback' }, { status: 403 });
    }
    
    // Parse request body
    const body = await req.json();
    const { 
      type, 
      comment, 
      targetElement, 
      targetRect, 
      screenshot, 
      courseSlug, 
      bookSlug 
    } = body;
    
    if (!type || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create feedback in database
    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        type,
        comment,
        targetElement,
        targetRect,
        screenshot,
        courseSlug: courseSlug || null,
        bookSlug: bookSlug || null,
        status: 'pending'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedbackId: feedback.id 
    });
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only allow admins and teachers to view all feedback
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      // Parents can only see their own feedback
      if (session.user.role === 'PARENT') {
        const feedback = await prisma.feedback.findMany({
          where: {
            userId: session.user.id
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return NextResponse.json({ feedback });
      }
      
      return NextResponse.json({ error: 'Not authorized to view feedback' }, { status: 403 });
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    // Build query
    const query = {
      where: {},
      orderBy: {
        createdAt: 'desc'
      },
      take: Math.min(limit, 100), // Limit to maximum 100 records
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    };
    
    // Add status filter if provided
    if (status) {
      query.where.status = status;
    }
    
    const feedback = await prisma.feedback.findMany(query);
    
    return NextResponse.json({ feedback });
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}