import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = session.user.id
    const userRole = session.user.role
    
    let stats = {}
    
    if (userRole === 'STUDENT') {
      // Student stats
      const enrolledClasses = await prisma.classEnrollment.count({
        where: { studentId: userId }
      })
      
      stats = {
        enrolledClasses,
        completedAssignments: 24,
        averageScore: 87,
        recentActivity: []
      }
    } else if (userRole === 'TEACHER') {
      // Teacher stats
      const classes = await prisma.class.count({
        where: { teacherId: userId }
      })
      
      const students = await prisma.classEnrollment.count({
        where: {
          class: {
            teacherId: userId
          }
        }
      })
      
      stats = {
        totalClasses: classes,
        totalStudents: students,
        activeClasses: Math.floor(classes * 0.8),
        recentActivity: []
      }
    } else if (userRole === 'ADMIN') {
      // Admin stats - school-wide data
      const totalStudents = await prisma.user.count({
        where: { role: 'STUDENT' }
      })
      
      const totalTeachers = await prisma.user.count({
        where: { role: 'TEACHER' }
      })
      
      const totalClasses = await prisma.class.count()
      
      stats = {
        totalStudents,
        totalTeachers,
        totalClasses,
        activeStudents: Math.floor(totalStudents * 0.85)
      }
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
  }
}