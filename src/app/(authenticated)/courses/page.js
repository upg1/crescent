'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCourses } from '@/hooks/useCourses'
import { useState } from 'react'

export default function Courses() {
  const { data: session, status } = useSession()
  const { courses, loading: loadingCourses, error } = useCourses()
  const router = useRouter()
  const loading = status === 'loading'
  
  // Colors for course cards
  const courseColors = [
    { bg: 'bg-blue-600', badge: 'bg-blue-700', emoji: '📐' },
    { bg: 'bg-green-600', badge: 'bg-green-700', emoji: '🧪' },
    { bg: 'bg-purple-600', badge: 'bg-purple-700', emoji: '📚' },
    { bg: 'bg-amber-600', badge: 'bg-amber-700', emoji: '🔬' },
    { bg: 'bg-red-600', badge: 'bg-red-700', emoji: '🌍' },
    { bg: 'bg-indigo-600', badge: 'bg-indigo-700', emoji: '🧠' },
  ]

  if (loading || loadingCourses) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="glassmorphism rounded-lg p-6 mb-8 text-red-400">
          <h1 className="text-2xl font-bold mb-4">Error Loading Courses</h1>
          <p>Sorry, we encountered an error while loading courses. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="glassmorphism rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
        <p className="text-muted-foreground">
          Continue your learning journey with these interactive courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map((course, index) => {
            const colorIndex = index % courseColors.length;
            const { bg, badge, emoji } = courseColors[colorIndex];
            
            return (
              <div key={course.id} className="card overflow-hidden">
                <div className={`h-40 ${bg} flex items-center justify-center relative`}>
                  <div className="text-4xl">{emoji}</div>
                  <div className={`absolute top-2 right-2 ${badge} text-white text-xs px-2 py-1 rounded`}>
                    {course.level || "All Levels"}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {course.description || "No description available for this course."}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-muted-foreground">
                      {course.lessons || 0} lessons
                    </span>
                    <span className="text-xs bg-blue-900/20 text-blue-500 px-2 py-1 rounded">
                      New
                    </span>
                  </div>
                  <Link 
                    href={`/courses/${course.id}`}
                    className="block w-full text-center bg-primary hover:bg-opacity-90 text-white py-2 rounded-md transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center p-10">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-bold mb-2">No Courses Available</h2>
            <p className="text-muted-foreground">
              We're preparing new courses for you. Please check back soon!
            </p>
          </div>
        )}
      </div>

      <div className="glassmorphism rounded-lg p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Your Learning Analytics</h2>
        <div className="bg-card border border-primary/20 rounded-lg p-4 h-40 flex items-center justify-center mb-4">
          <p className="text-muted-foreground">
            Dynamic Bayesian network visualization of your learning progress
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Our adaptive learning system uses Dynamic Bayesian Networks to model your knowledge state and provide personalized recommendations for maximum learning efficiency.
        </p>
      </div>
    </div>
  )
}