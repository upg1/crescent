'use client'

import { useState, useRef, useEffect } from 'react'
import { useFeedback } from './FeedbackContext'
import { useSession } from 'next-auth/react'

export function PedagogicalParagraph({ 
  id, 
  children, 
  className = '', 
  isInteractive = true,
  concept = null,
  standards = [],
  onClick
}) {
  const { openFeedback } = useFeedback()
  const { data: session } = useSession()
  const isParent = session?.user?.role === 'PARENT'
  
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const paragraphRef = useRef(null)
  
  // Handle click outside to close the options
  useEffect(() => {
    function handleClickOutside(event) {
      if (paragraphRef.current && !paragraphRef.current.contains(event.target)) {
        setShowOptions(false)
        setIsHighlighted(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const handleParagraphClick = (e) => {
    e.stopPropagation() // Prevent parent click handlers from firing
    
    if (onClick) {
      onClick(id)
    }
    
    if (!isInteractive || !isParent) return
    
    setIsHighlighted(true)
    setShowOptions(true)
  }
  
  const handleFeedbackClick = (e) => {
    e.stopPropagation()
    if (paragraphRef.current) {
      openFeedback(paragraphRef.current)
    }
    setShowOptions(false)
  }
  
  const handleStandardsClick = (e) => {
    e.stopPropagation()
    // This would open the standards view with the relevant standards highlighted
    console.log('Standards for paragraph:', standards)
    
    // In a real implementation, this would navigate to the standards explorer
    // and highlight the relevant standards
    setShowOptions(false)
  }
  
  const baseClass = 'relative py-2 transition-colors'
  const interactiveClass = isInteractive && isParent ? 'cursor-pointer hover:bg-primary/5' : ''
  const highlightClass = isHighlighted ? 'bg-primary/10 !rounded-md px-3' : ''
  
  return (
    <div 
      ref={paragraphRef}
      id={id}
      className={`${baseClass} ${interactiveClass} ${highlightClass} ${className}`}
      onClick={handleParagraphClick}
      data-concept={concept}
      data-standards={standards.join(',')}
    >
      <div className="relative">
        {children}
        
        {showOptions && isParent && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 translate-x-full flex flex-col space-y-2 z-10">
            <button
              onClick={handleFeedbackClick}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary/10 transition-colors"
              title="Provide feedback"
            >
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            {standards.length > 0 && (
              <button
                onClick={handleStandardsClick}
                className="p-2 bg-white rounded-full shadow-md hover:bg-primary/10 transition-colors"
                title="View related standards"
              >
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}