import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only allow admins to update feedback status
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only administrators can update feedback status' }, { status: 403 });
    }
    
    // Parse request body
    const body = await req.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json({ error: 'Missing status field' }, { status: 400 });
    }
    
    // Validate status
    const validStatuses = ['pending', 'reviewed', 'implemented', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    // Update feedback status
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback status updated successfully',
      feedback: updatedFeedback
    });
    
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return NextResponse.json({ error: 'Failed to update feedback status' }, { status: 500 });
  }
}