'use client'

import { useState, useEffect } from 'react'

export function ScholarLinkVerification({ session }) {
  const [pendingLinks, setPendingLinks] = useState([])
  const [linkedParents, setLinkedParents] = useState([])
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [linkCode, setLinkCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState('')
  const [verificationMessage, setVerificationMessage] = useState('')
  const [parentInfo, setParentInfo] = useState(null)
  
  // Fetch pending link requests and linked parents on component mount
  useEffect(() => {
    fetchPendingLinks()
    fetchLinkedParents()
  }, [])
  
  // Fetch pending link requests
  const fetchPendingLinks = async () => {
    try {
      const response = await fetch('/api/scholars/link')
      if (!response.ok) {
        throw new Error('Failed to fetch pending links')
      }
      
      const data = await response.json()
      setPendingLinks(data.scholarLinks.filter(link => link.status === 'PENDING'))
    } catch (error) {
      console.error('Error fetching pending links:', error)
    }
  }
  
  // Fetch linked parents
  const fetchLinkedParents = async () => {
    try {
      const response = await fetch('/api/scholars/linked-parents')
      if (!response.ok) {
        throw new Error('Failed to fetch linked parents')
      }
      
      const data = await response.json()
      setLinkedParents(data.parents)
    } catch (error) {
      console.error('Error fetching linked parents:', error)
    }
  }
  
  // Open verification modal
  const verifyLink = () => {
    setLinkCode('')
    setVerificationStatus('')
    setVerificationMessage('')
    setParentInfo(null)
    setShowVerifyModal(true)
  }
  
  // Submit verification code
  const submitVerification = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setVerificationStatus('')
    setVerificationMessage('')
    
    try {
      const response = await fetch('/api/scholars/link', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkCode }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setVerificationStatus('error')
        setVerificationMessage(data.error || 'Failed to verify link code')
        return
      }
      
      setVerificationStatus('success')
      setVerificationMessage(data.message)
      setParentInfo(data.parent)
      
      // Refresh pending links
      fetchPendingLinks()
    } catch (error) {
      console.error('Error verifying link code:', error)
      setVerificationStatus('error')
      setVerificationMessage('An error occurred while verifying the code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // If user is not a student, don't render anything
  if (session.user.role !== 'STUDENT') {
    return null
  }
  
  return (
    <div>
      {pendingLinks.length > 0 ? (
        <div className="glassmorphism rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Pending Parent Link Requests</h2>
          </div>
          
          <div className="space-y-4">
            {pendingLinks.map(link => (
              <div key={link.id} className="glass-card !p-4 !bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{link.parent.name || link.parent.email}</h4>
                    <p className="text-sm text-medium-contrast">{link.parent.email}</p>
                    <p className="text-sm text-medium-contrast mt-1">
                      Wants to connect to your account as a parent/guardian
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg text-sm hover:shadow-md transition-all"
                      onClick={verifyLink}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-primary/5 rounded-lg p-4 mb-8">
          <button
            onClick={verifyLink}
            className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Link Parent Account
          </button>
        </div>
      )}
      
      {/* Linked Parents Section */}
      {linkedParents.length > 0 && (
        <div className="glassmorphism rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Linked Parents</h2>
          </div>
          
          <div className="space-y-4">
            {linkedParents.map(parent => (
              <div key={parent.id} className="glass-card !p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{parent.name || parent.email}</h4>
                    <p className="text-sm text-medium-contrast">{parent.email}</p>
                    <p className="text-sm text-medium-contrast mt-1">
                      Connected since {new Date(parent.linkedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                      onClick={() => handleViewDetails(parent)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm pointer-events-auto" 
                   onClick={() => setShowVerifyModal(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-middle glassmorphism rounded-xl text-left overflow-hidden transform transition-all sm:max-w-lg w-full pointer-events-auto">
              <div className="px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-xl leading-6 font-medium text-high-contrast">
                      Verify Parent Link
                    </h3>
                    
                    <div className="mt-2 mb-4">
                      <p className="text-sm text-medium-contrast">
                        Enter the verification code provided by your parent or guardian to link your accounts.
                      </p>
                    </div>
                    
                    {verificationStatus === 'success' ? (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <div className="flex items-center justify-center">
                          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-green-800 font-medium mt-3 mb-2">Account Linked Successfully!</div>
                        {parentInfo && (
                          <div className="bg-white rounded-lg p-3 my-3 text-left border border-green-200">
                            <p className="text-sm font-medium">Parent/Guardian:</p>
                            <p className="text-sm">{parentInfo.name || parentInfo.email}</p>
                            <p className="text-xs text-medium-contrast">{parentInfo.email}</p>
                          </div>
                        )}
                        <p className="text-sm text-green-700 mb-4">{verificationMessage}</p>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg"
                          onClick={() => setShowVerifyModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={submitVerification} className="mt-4">
                        <div className="mb-4">
                          <label htmlFor="linkCode" className="block text-sm font-medium text-high-contrast mb-2">
                            Verification Code
                          </label>
                          <input
                            type="text"
                            id="linkCode"
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full text-lg font-mono tracking-wider text-center py-3 rounded-lg"
                            placeholder="000000"
                            value={linkCode}
                            onChange={(e) => setLinkCode(e.target.value)}
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                          />
                          <p className="mt-1 text-xs text-medium-contrast">
                            This 6-digit code was provided to your parent/guardian when they requested to link with your account.
                          </p>
                        </div>
                        
                        {verificationStatus === 'error' && (
                          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{verificationMessage}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-high-contrast bg-white/80 border border-accent-border rounded-lg"
                            onClick={() => setShowVerifyModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-dark rounded-lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                              </span>
                            ) : 'Verify Link'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Note: handleViewDetails function is not defined in the provided code, you need to implement it
function handleViewDetails(parent) {
  // Implement the logic to view parent details
}