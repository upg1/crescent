'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNav } from '@/components/navigation/NavContext';

export default function FeedbackManagement() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: session } = useSession();
  const { setBreadcrumbs } = useNav();
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Feedback' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'implemented', label: 'Implemented' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Feedback Management', href: '/feedback' }
    ]);
  }, [setBreadcrumbs]);
  
  // Fetch feedback
  useEffect(() => {
    async function fetchFeedback() {
      try {
        setIsLoading(true);
        const queryParams = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
        const response = await fetch(`/api/feedback${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        
        const data = await response.json();
        setFeedback(data.feedback || []);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFeedback();
  }, [statusFilter]);
  
  // Handle status update
  const updateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update feedback status');
      }
      
      // Update local state
      setFeedback(prev => 
        prev.map(item => 
          item.id === feedbackId ? { ...item, status: newStatus } : item
        )
      );
      
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Access control - only teachers and admins should access this page
  const isAuthorized = session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN';
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-2xl w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>You do not have permission to access this page. Only teachers and administrators can manage feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Review and manage feedback submitted by parents
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : feedback.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No feedback found for the selected filter.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-6">
            {feedback.map((item) => (
              <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900">
                        Feedback on {item.paragraphId}
                      </h3>
                      
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                        <p className="italic text-gray-600 mb-1">"
                          {item.elementContent ? 
                            (item.elementContent.length > 100 ? item.elementContent.substring(0, 100) + '...' : item.elementContent) 
                            : 'No content provided'}
                        "</p>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">Feedback Type:</h4>
                        <p className="text-sm text-gray-900 mt-1">{item.feedbackType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      </div>
                      
                      {item.comment && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700">Comment:</h4>
                          <p className="text-sm text-gray-900 mt-1">{item.comment}</p>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">Submitted by:</h4>
                        <p className="text-sm text-gray-900 mt-1">{item.user?.name || item.user?.email || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status update buttons */}
                  {session?.user?.role === 'ADMIN' && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.status !== 'reviewed' && (
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'reviewed')}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          Mark as Reviewed
                        </button>
                      )}
                      
                      {item.status !== 'implemented' && (
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'implemented')}
                          className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                        >
                          Mark as Implemented
                        </button>
                      )}
                      
                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'rejected')}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}