'use client'

import { useState } from 'react'
import { useFeedback } from './FeedbackContext'
import { useSession } from 'next-auth/react'

const FEEDBACK_TYPES = [
  { id: 'rephrase', label: 'Should be rephrased', icon: '✏️', description: 'The content is unclear or could be better explained' },
  { id: 'incorrect', label: 'Contains incorrect information', icon: '❌', description: 'The content has factual errors' },
  { id: 'misleading', label: 'Could be misleading', icon: '⚠️', description: 'The content could lead to misconceptions' },
  { id: 'incomplete', label: 'Information is incomplete', icon: '➕', description: 'Content is missing important details' },
  { id: 'too_advanced', label: 'Too advanced', icon: '🔬', description: 'The content is too complex for the target audience' },
  { id: 'too_basic', label: 'Too basic', icon: '🔍', description: 'The content is too simple for the target audience' },
  { id: 'other', label: 'Other', icon: '💬', description: 'Other feedback not covered by the categories above' },
]

export function FeedbackModal() {
  const { 
    isOpen, 
    closeFeedback, 
    targetElement, 
    feedbackType, 
    setFeedbackType,
    comment,
    setComment,
    submitFeedback 
  } = useFeedback()
  
  const { data: session } = useSession()
  const isParent = session?.user?.role === 'PARENT'
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  if (!isOpen) return null
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!feedbackType) {
      alert('Please select a feedback type')
      return
    }
    
    setIsSubmitting(true)
    try {
      await submitFeedback()
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
      <div className="flex items-start justify-end min-h-screen p-4 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-transparent pointer-events-auto"></div>
        </div>

        <div className="fixed right-8 top-24 inline-block align-top glassmorphism rounded-xl text-left overflow-hidden transform transition-all max-w-sm w-full pointer-events-auto">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-primary/20">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-3 text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-high-contrast accent-gradient">
                    Submit Feedback
                  </h3>
                  <button 
                    onClick={closeFeedback}
                    className="text-medium-contrast hover:text-high-contrast"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-2 mb-3">
                  <p className="text-xs text-medium-contrast">
                    {isParent 
                      ? "Your feedback helps us improve our educational content." 
                      : "Thank you for helping us improve our content."}
                  </p>
                </div>
                
                <div className="glass-card !p-3 mb-4">
                  <p className="text-xs uppercase font-medium text-medium-contrast mb-0.5">Selected Content</p>
                  <p className="text-xs text-high-contrast">
                    "{targetElement?.textContent?.substring(0, 80)}{targetElement?.textContent?.length > 80 ? '...' : ''}"
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-high-contrast mb-1">
                      Feedback Type
                    </label>
                    <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                      {FEEDBACK_TYPES.map((type) => (
                        <div 
                          key={type.id}
                          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all ${
                            feedbackType === type.id 
                              ? 'glass-card !p-2 border-primary shadow-sm' 
                              : 'hover:bg-primary/5 border border-transparent'
                          }`}
                          onClick={() => setFeedbackType(type.id)}
                        >
                          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-base">
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-high-contrast">{type.label}</p>
                            <p className="text-xs text-medium-contrast">{type.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-xs font-medium text-high-contrast mb-1">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      id="comment"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full text-xs border-accent-border rounded-md"
                      rows="2"
                      placeholder="Add any specific suggestions or comments..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-primary to-primary-dark border border-transparent rounded-md shadow-sm hover:shadow-md transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}