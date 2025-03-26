'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export function ParentNote() {
  const { data: session } = useSession()
  const [showNotePanel, setShowNotePanel] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [notes, setNotes] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('personal') // 'personal', 'marginal'
  const noteInputRef = useRef(null)
  
  const isParent = session?.user?.role === 'PARENT'

  // Load saved notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('zettelNotes')
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error('Error loading notes from localStorage:', error)
      }
    } else {
      setNotes([])
    }
  }, [])

  // Save notes to localStorage when they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('zettelNotes', JSON.stringify(notes))
    }
  }, [notes])
  
  // Focus input when the panel is opened
  useEffect(() => {
    if (showNotePanel && noteInputRef.current) {
      noteInputRef.current.focus()
    }
  }, [showNotePanel])
  
  // Handle saving a new note
  const saveNote = async (e) => {
    e.preventDefault()
    
    if (!noteContent.trim()) return
    if (activeTab === 'personal' && !noteTitle.trim()) return
    
    setIsSubmitting(true)
    
    try {
      // Get current page data
      const pageUrl = window.location.href
      const pathParts = window.location.pathname.split('/')
      
      // Extract courseId and bookId from URL if present
      let sourceId = null
      let sourceType = null
      let position = null
      
      const courseIndex = pathParts.indexOf('courses')
      if (courseIndex !== -1 && courseIndex + 1 < pathParts.length) {
        sourceId = pathParts[courseIndex + 1]
        sourceType = 'course'
        
        // Check for book ID
        const bookIndex = pathParts.indexOf('books')
        if (bookIndex !== -1 && bookIndex + 1 < pathParts.length) {
          sourceId = pathParts[bookIndex + 1]
          sourceType = 'book'
        }
      }
      
      // If it's a marginal note, capture position information
      if (activeTab === 'marginal') {
        // In a real implementation, this would capture scroll position or selection
        position = JSON.stringify({
          scrollY: window.scrollY,
          selection: window.getSelection().toString().substring(0, 100)
        })
      }
      
      const newNote = {
        id: `parent-note-${Date.now()}`,
        title: activeTab === 'personal' ? noteTitle : `Note on ${document.title}`,
        content: noteContent,
        type: activeTab === 'personal' ? 'permanent' : 'marginal',
        isParentNote: true,
        noteRole: activeTab,
        visibility: "private",
        sourceId,
        sourceType,
        position,
        createdAt: new Date().toISOString(),
        pageUrl,
        pageTitle: document.title,
        tags: []
      }
      
      // In a real app, this would save to the server
      // For now, just save to state and localStorage
      setNotes([newNote, ...notes])
      setNoteContent('')
      
      if (activeTab === 'personal') {
        setNoteTitle('')
      }
      
      localStorage.setItem('zettelNotes', JSON.stringify([newNote, ...notes]))
      
      // In a real app, we would persist this to the database
      // await fetch('/api/notes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newNote),
      // })
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle deleting a note
  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }
  
  // If user is not authenticated or not a parent, don't render anything
  if (!session || !isParent) {
    return null
  }
  
  return (
    <div className="absolute" style={{height: 0, width: 0, overflow: 'visible'}}>
      {/* Parent Note Button */}
      <button
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full glassmorphism border border-accent-border text-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        onClick={() => setShowNotePanel(!showNotePanel)}
        aria-label="Parent Notes"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      
      {/* Note Panel */}
      <div className={`fixed bottom-20 left-6 z-40 w-96 glassmorphism rounded-lg shadow-xl transform transition-all duration-300 ${
        showNotePanel ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium accent-gradient">Parent Notes</h3>
            <button 
              className="text-medium-contrast hover:text-high-contrast"
              onClick={() => setShowNotePanel(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-accent-border mb-4">
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'personal' ? 'text-primary border-b-2 border-primary' : 'text-medium-contrast'}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Notes
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'marginal' ? 'text-primary border-b-2 border-primary' : 'text-medium-contrast'}`}
              onClick={() => setActiveTab('marginal')}
            >
              Marginal Notes
            </button>
          </div>
          
          <form onSubmit={saveNote} className="mb-3">
            {activeTab === 'personal' && (
              <div className="mb-3">
                <input
                  type="text"
                  className="w-full p-2 rounded-lg bg-glass-bg border border-accent-border focus:ring-primary focus:border-primary text-sm"
                  placeholder="Note Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required={activeTab === 'personal'}
                />
              </div>
            )}
            
            <textarea
              ref={noteInputRef}
              className="w-full p-3 rounded-lg bg-glass-bg border border-accent-border focus:ring-primary focus:border-primary text-sm"
              placeholder={activeTab === 'personal' 
                ? "Write a personal note..." 
                : "Add a note about what you're reading..."}
              rows="4"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
            ></textarea>
            
            <div className="flex justify-between mt-2">
              {activeTab === 'marginal' && (
                <div className="text-xs text-indigo-600 italic">
                  Marginal notes are linked to this content
                </div>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  disabled={isSubmitting || !noteContent.trim() || (activeTab === 'personal' && !noteTitle.trim())}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg text-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Note'}
                </button>
              </div>
            </div>
          </form>
          
          <div className="max-h-64 overflow-y-auto">
            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map(note => (
                  <div 
                    key={note.id} 
                    className="p-3 glassmorphism rounded-lg text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{note.title}</h4>
                        <p>{note.content}</p>
                      </div>
                      <button
                        className="ml-2 text-medium-contrast hover:text-red-500"
                        onClick={() => deleteNote(note.id)}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-medium-contrast">
                      {new Date(note.createdAt).toLocaleString()}
                      {note.pageTitle && activeTab === 'marginal' && (
                        <span className="ml-1">• {note.pageTitle}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-medium-contrast italic text-center py-4">
                No {activeTab} notes yet. Create one!
              </p>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-accent-border">
            <a 
              href="/dashboard?view=notes" 
              className="text-xs text-primary hover:text-primary-dark flex items-center justify-center"
            >
              View all notes in your Library
              <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}