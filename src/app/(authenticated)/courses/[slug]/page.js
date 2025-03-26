'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function CoursePage({ params }) {
  const { data: session, status } = useSession()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch course')
        }
        const data = await response.json()
        setCourse(data)
        setError(null)
      } catch (err) {
        setError(err)
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Error loading course</h2>
          <p className="text-sm opacity-70">Please try refreshing the page.</p>
          <Link 
            href="/courses" 
            className="text-primary hover:text-primary-dark mt-2 inline-block"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Course not found</h2>
          <p className="text-sm opacity-70">The course you're looking for doesn't exist.</p>
          <Link 
            href="/courses" 
            className="text-primary hover:text-primary-dark mt-2 inline-block"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-lg opacity-80">{course.description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.books.map((book) => (
          <div 
            key={book.id}
            className={`glassmorphism rounded-lg p-6 transition-all hover:shadow-md hover:scale-[1.01] ${
              selectedBook?.id === book.id ? 'bg-primary/10' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <img 
                src={`/books/${book.slug}/cover.svg`} 
                alt="" 
                className="w-6 h-6"
              />
            </div>
            <h2 className="text-xl font-semibold mb-1">{book.title}</h2>
            <div className="text-sm opacity-70 mb-3">{book.level}</div>
            <p className="text-sm opacity-80 mb-4">{book.description}</p>
            <div className="flex justify-between items-center">
              <div className="text-xs bg-primary/10 px-3 py-1 rounded-full">
                {book.lessons} lessons
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/courses/${course.slug}/${book.slug}`}
                  className="text-primary text-sm"
                  onClick={() => setSelectedBook(book)}
                >
                  Course →
                </Link>
                <Link 
                  href={`/books/${book.slug}`}
                  className="text-primary text-sm"
                >
                  Book →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
