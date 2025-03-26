'use client'

import { useState, useEffect } from 'react'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/books')
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        setBooks(data)
        setError(null)
      } catch (err) {
        setError(err)
        console.error('Error fetching books:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return { books, loading, error }
}
