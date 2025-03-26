import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Generate a linking code
export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only parent users can generate linking codes
    if (session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Only parent users can generate linking codes' }, { status: 403 });
    }
    
    // Parse request body for the scholar's email
    const { email } = await req.json();
    
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Scholar email is required' }, { status: 400 });
    }
    
    // Find the scholar by email
    const scholar = await prisma.user.findUnique({
      where: { email: email.trim() },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    
    if (!scholar) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }
    
    if (scholar.role !== 'STUDENT') {
      return NextResponse.json({ error: 'This user is not a student account' }, { status: 400 });
    }
    
    // Check if already linked
    const alreadyLinked = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        scholarParent: {
          some: {
            scholarId: scholar.id
          }
        }
      }
    });
    
    if (alreadyLinked) {
      return NextResponse.json({ error: 'This scholar is already linked to your account' }, { status: 400 });
    }
    
    // Check if a pending link already exists
    const existingLink = await prisma.scholarLink.findFirst({
      where: {
        OR: [
          { parentId: session.user.id, scholarId: scholar.id },
          { scholarId: scholar.id, status: 'PENDING' }
        ],
        expiresAt: { gt: new Date() }
      }
    });
    
    if (existingLink) {
      // If the link exists but is expired, update it
      if (existingLink.expiresAt < new Date()) {
        // Generate a new 6-digit verification code
        const linkCode = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours
        
        const updatedLink = await prisma.scholarLink.update({
          where: { id: existingLink.id },
          data: {
            linkCode,
            status: 'PENDING',
            expiresAt
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Link code generated successfully. The scholar must enter this code to confirm the link.',
          linkCode,
          expiresAt
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'A link code already exists for this scholar',
        linkCode: existingLink.linkCode,
        expiresAt: existingLink.expiresAt
      });
    }
    
    // Generate a new 6-digit verification code
    const linkCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours
    
    // Create a new scholar link
    const scholarLink = await prisma.scholarLink.create({
      data: {
        parentId: session.user.id,
        scholarId: scholar.id,
        linkCode,
        status: 'PENDING',
        expiresAt
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Link code generated successfully. The scholar must enter this code to confirm the link.',
      linkCode,
      expiresAt
    });
    
  } catch (error) {
    console.error('Error generating scholar link:', error);
    return NextResponse.json({ error: 'Failed to generate link code' }, { status: 500 });
  }
}

// Verify a linking code (used by students)
export async function PUT(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only student users can verify linking codes
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only student accounts can verify linking codes' }, { status: 403 });
    }
    
    // Parse request body for the verification code
    const { linkCode } = await req.json();
    
    if (!linkCode || !linkCode.trim()) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }
    
    // Find the pending link with this code
    const scholarLink = await prisma.scholarLink.findFirst({
      where: {
        scholarId: session.user.id,
        linkCode: linkCode.trim(),
        status: 'PENDING',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!scholarLink) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }
    
    // Update the link status to verified
    const updatedLink = await prisma.scholarLink.update({
      where: { id: scholarLink.id },
      data: {
        status: 'APPROVED',
        verifiedAt: new Date()
      }
    });
    
    // Create the parent-scholar relationship
    await prisma.user.update({
      where: { id: scholarLink.parentId },
      data: {
        scholarParent: {
          connect: { id: scholarLink.id }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Account linked successfully',
      parent: scholarLink.parent
    });
    
  } catch (error) {
    console.error('Error verifying scholar link:', error);
    return NextResponse.json({ error: 'Failed to verify link code' }, { status: 500 });
  }
}

// Get pending links for a user
export async function GET(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get the pending links
    const query = {
      where: {
        status: 'PENDING',
        expiresAt: { gt: new Date() }
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        scholar: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    };

    if (session.user.role === 'PARENT') {
      query.where.parentId = session.user.id;
    } else if (session.user.role === 'STUDENT') {
      query.where.scholarId = session.user.id;
    } else {
      return NextResponse.json({ 
        success: false,
        error: 'Only parents and students can access scholar links' 
      }, { status: 403 });
    }

    const scholarLinks = await prisma.scholarLink.findMany(query);
    
    return NextResponse.json({
      success: true,
      links: scholarLinks
    });
    
  } catch (error) {
    console.error('Error getting scholar links:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to get scholar links' 
    }, { status: 500 });
  }
}