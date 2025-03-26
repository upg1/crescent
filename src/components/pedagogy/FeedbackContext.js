'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const FeedbackContext = createContext({
  isOpen: false,
  openFeedback: () => {},
  closeFeedback: () => {},
  targetElement: null,
  setTargetElement: () => {},
  feedbackType: null,
  setFeedbackType: () => {},
  comment: '',
  setComment: () => {},
  submitFeedback: () => {},
  breadcrumbs: [],
  courseId: null,
  bookId: null,
})

export function FeedbackProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [targetElement, setTargetElement] = useState(null)
  const [feedbackType, setFeedbackType] = useState(null)
  const [comment, setComment] = useState('')
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [courseId, setCourseId] = useState(null)
  const [bookId, setBookId] = useState(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Extract courseId and bookId from URL if present
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean)
    const courseIndex = pathParts.indexOf('courses')
    
    if (courseIndex !== -1) {
      if (pathParts[courseIndex + 1]) {
        setCourseId(pathParts[courseIndex + 1])
        if (pathParts[courseIndex + 2] === 'books' && pathParts[courseIndex + 3]) {
          setBookId(pathParts[courseIndex + 3])
        }
      }
    }
  }, [pathname])

  // Update breadcrumbs based on URL
  useEffect(() => {
    const newBreadcrumbs = []
    if (courseId) {
      newBreadcrumbs.push({
        label: 'Course: ' + courseId,
        href: `/courses/${courseId}`
      })
    }
    if (bookId) {
      newBreadcrumbs.push({
        label: 'Book: ' + bookId,
        href: `/courses/${courseId}/books/${bookId}`
      })
    }
    setBreadcrumbs(newBreadcrumbs)
  }, [courseId, bookId])

  const openFeedback = (element) => {
    setTargetElement(element)
    setIsOpen(true)
  }
  
  const closeFeedback = () => {
    setIsOpen(false)
    setTargetElement(null)
    setFeedbackType(null)
    setComment('')
  }
  
  const submitFeedback = async () => {
    try {
      // Send feedback to the server using the API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elementId: targetElement?.id,
          elementContent: targetElement?.textContent,
          feedbackType,
          comment,
          courseId,
          bookId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }
      
      closeFeedback();
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  }
  
  const value = {
    isOpen,
    openFeedback,
    closeFeedback,
    targetElement,
    setTargetElement,
    feedbackType,
    setFeedbackType,
    comment,
    setComment,
    submitFeedback,
    breadcrumbs,
    courseId,
    bookId,
  }
  
  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}