'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export function QuickNote({ tags = [], links = [] }) {
  const { data: session } = useSession()
  const [showNotePanel, setShowNotePanel] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [noteTags, setNoteTags] = useState('')
  const [noteLinks, setNoteLinks] = useState('')
  const [notes, setNotes] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const noteInputRef = useRef(null)

  // Load notes from API on component mount
  useEffect(() => {
    if (!session?.user?.id) return

    const loadNotes = async () => {
      try {
        const response = await fetch('/api/notes/quick')
        if (!response.ok) {
          throw new Error('Failed to load notes')
        }
        const data = await response.json()
        setNotes(data)
      } catch (error) {
        console.error('Error loading notes:', error)
      }
    }

    loadNotes()
  }, [session?.user?.id])

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
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/notes/quick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: noteContent,
          tags: noteTags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save note')
      }

      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setNoteContent('')
      setNoteTags('')
      setNoteLinks('')
      setShowNotePanel(false)
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle deleting a note
  const deleteNote = async (noteId) => {
    try {
      const response = await fetch('/api/notes/quick', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: noteId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete note')
      }

      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  // If user is not authenticated, don't render anything
  if (!session) {
    return null
  }

  return (
    <div className="absolute" style={{height: 0, width: 0, overflow: 'visible'}}>
      {/* Quick Note Button */}
      <button
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full glassmorphism border border-accent-border text-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        onClick={() => setShowNotePanel(!showNotePanel)}
        aria-label="Quick Note"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      
      {/* Note Panel */}
      <div className={`fixed bottom-20 right-6 z-40 w-96 glassmorphism rounded-lg shadow-xl transform transition-all duration-300 ${
        showNotePanel ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Quick Notes</h3>
            <button 
              className="text-medium-contrast hover:text-high-contrast"
              onClick={() => setShowNotePanel(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={saveNote} className="mb-3">
            <textarea
              ref={noteInputRef}
              className="w-full p-4 rounded-lg border border-accent-border focus:border-accent-color focus:outline-none text-sm font-serif bg-glass-bg"
              rows="4"
              placeholder="Write a quick note about what you're reading..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            
            <div className="space-y-2 mt-3">
              <div>
                <label className="block text-sm font-medium text-high-contrast mb-1">Tags</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-accent-border focus:border-accent-color focus:outline-none text-sm bg-glass-bg"
                  placeholder="Enter tags (comma separated)"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-high-contrast mb-1">Links</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-accent-border focus:border-accent-color focus:outline-none text-sm bg-glass-bg"
                  placeholder="Enter links (comma separated)"
                  value={noteLinks}
                  onChange={(e) => setNoteLinks(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={isSubmitting || !noteContent.trim()}
                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg text-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
          
          <div className="max-h-60 overflow-y-auto">
            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map(note => (
                  <div key={note.id} className="p-3 border border-accent-border rounded-lg bg-glass-bg text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="mb-1">{note.content}</p>
                        {note.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {note.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {note.links?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.links.map(link => (
                              <a key={link} href={link} className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">
                                {link}
                              </a>
                            ))}
                          </div>
                        )}
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
                    <div className="mt-2 text-xs text-light-contrast">
                      {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-medium-contrast italic text-center py-4">
                No notes yet. Create one!
              </p>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-accent-border">
            <a 
              href="/dashboard?view=notes" 
              className="text-xs text-primary hover:text-primary-dark flex items-center justify-center"
            >
              View all notes in Zettelkasten
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