'use client'

import { useState, useEffect } from 'react'

export function useCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        // Make sure we're using the exact URL string
        const response = await fetch('/api/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        
        const data = await response.json()
        setCourses(data)
        setError(null)
      } catch (err) {
        setError(err)
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return { courses, loading, error }
}