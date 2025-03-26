'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Brain, BrainCircuit, Network, BookOpen, 
  LightbulbIcon, Filter, Search, Plus, Link as LinkIcon
} from 'lucide-react'

// Note types for the Zettelkasten method
export const NOTE_TYPES = {
  FLEETING: 'fleeting',
  LITERATURE: 'literature',
  PERMANENT: 'permanent',
  BRIDGE: 'bridge',
  CONSOLIDATED: 'consolidated'
}

// Note type descriptions for UI
export const NOTE_TYPE_INFO = {
  [NOTE_TYPES.FLEETING]: {
    name: 'Fleeting Notes',
    description: 'Quick, temporary notes to capture ideas before they fade.',
    color: '#7c3aed', // Purple
    icon: '💭',
    retention: 'Low',
    nextStep: NOTE_TYPES.LITERATURE
  },
  [NOTE_TYPES.LITERATURE]: {
    name: 'Literature Notes',
    description: 'Notes from books, articles, and other sources.',
    color: '#4f46e5', // Indigo
    icon: '📖',
    retention: 'Medium',
    nextStep: NOTE_TYPES.PERMANENT
  },
  [NOTE_TYPES.PERMANENT]: {
    name: 'Permanent Notes',
    description: 'Refined ideas in your own words, with connections to other notes.',
    color: '#2563eb', // Blue
    icon: '🧠',
    retention: 'High',
    nextStep: NOTE_TYPES.CONSOLIDATED
  },
  [NOTE_TYPES.BRIDGE]: {
    name: 'Bridge Notes',
    description: 'Connect concepts across different areas of knowledge.',
    color: '#059669', // Green
    icon: '🌉',
    retention: 'Medium-High',
    nextStep: NOTE_TYPES.CONSOLIDATED
  },
  [NOTE_TYPES.CONSOLIDATED]: {
    name: 'Consolidated Notes',
    description: 'Synthesis of multiple notes into a cohesive whole.',
    color: '#d97706', // Amber
    icon: '⭐',
    retention: 'Very High',
    nextStep: null
  }
}

export default function Notebook() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === 'loading'
  
  // States for the notebook
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [concepts, setConcepts] = useState([])
  const [activeType, setActiveType] = useState(NOTE_TYPES.FLEETING)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])
  
  // States for new note creation
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [newNoteTags, setNewNoteTags] = useState('')
  const [newNoteType, setNewNoteType] = useState(NOTE_TYPES.FLEETING)
  const [relatedNotes, setRelatedNotes] = useState([])
  const [selectedRelatedNotes, setSelectedRelatedNotes] = useState([])
  
  // States for digital twin and student model
  const [retentionScore, setRetentionScore] = useState(0)
  const [understandingScore, setUnderstandingScore] = useState(0)
  const [conceptConnections, setConceptConnections] = useState([])
  const [currentCourse, setCurrentCourse] = useState(null)
  const [courses, setCourses] = useState([])
  
  // UI states
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState('cards') // 'cards' or 'list'
  const [showRetentionHints, setShowRetentionHints] = useState(true)
  const [viewMode, setViewMode] = useState('all') // 'all', 'tags', 'concepts'
  
  // Refs
  const newNoteDialogRef = useRef(null)
  
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotes()
      fetchConcepts()
      fetchDigitalTwinData()
      fetchCourses()
    }
  }, [session])
  
  // Filter notes based on active type, search term, and selected tags
  useEffect(() => {
    if (!notes.length) {
      setFilteredNotes([])
      return
    }
    
    let filtered = notes
    
    // Filter by type
    if (activeType !== 'all') {
      filtered = filtered.filter(note => note.type === activeType)
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term)
      )
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        selectedTags.every(tag => note.tags.includes(tag))
      )
    }
    
    // Filter by course if selected
    if (currentCourse) {
      filtered = filtered.filter(note => 
        note.courseId === currentCourse.id
      )
    }
    
    setFilteredNotes(filtered)
  }, [notes, activeType, searchTerm, selectedTags, currentCourse])
  
  // Extract all unique tags from notes
  useEffect(() => {
    if (notes.length) {
      const tags = new Set()
      notes.forEach(note => {
        note.tags.forEach(tag => tags.add(tag))
      })
      setAllTags(Array.from(tags))
    }
  }, [notes])
  
  // Fetch real notes from DB
  const fetchNotes = async () => {
    setIsLoading(true)
    try {
      // In a real app, fetch from API
      // const response = await fetch('/api/notes/all')
      // if (!response.ok) throw new Error('Failed to fetch notes')
      // const data = await response.json()
      // setNotes(data)
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock notes data - Replace with actual API response
      const mockNotes = [
        {
          id: '1',
          title: 'Dynamic Bayesian Networks Overview',
          content: 'Dynamic Bayesian Networks (DBNs) are graphical models for representing probability distributions over multiple random variables across time.',
          type: NOTE_TYPES.FLEETING,
          tags: ['AI', 'Bayesian', 'GraphicalModels'],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          conceptId: '1',
          courseId: 'c1',
          relatedNotes: [],
          retention: 0.3,
          mnemonicType: null
        },
        {
          id: '2',
          title: 'Zettelkasten Method',
          content: 'The Zettelkasten method is a personal knowledge management system designed to enhance learning and facilitate connections between ideas.',
          type: NOTE_TYPES.LITERATURE,
          tags: ['Learning', 'Organization', 'Notes'],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          conceptId: '2',
          courseId: 'c1',
          relatedNotes: ['3'],
          retention: 0.7,
          mnemonicType: 'storyMethod'
        },
        {
          id: '3',
          title: 'Effective Learning Strategies',
          content: 'Spaced repetition, active recall, and interleaving are proven techniques for enhancing long-term retention and understanding.',
          type: NOTE_TYPES.PERMANENT,
          tags: ['Learning', 'Memory', 'Education'],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          conceptId: '3',
          courseId: 'c1',
          relatedNotes: ['2'],
          retention: 0.85,
          mnemonicType: 'storyMethod'
        },
        {
          id: '4',
          title: 'Connection Between Bayesian Networks and Learning',
          content: 'Bayesian networks can model the learning process by representing knowledge states as nodes and learning activities as conditional probabilities.',
          type: NOTE_TYPES.BRIDGE,
          tags: ['AI', 'Learning', 'Bayesian'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          conceptId: '4',
          courseId: 'c2',
          relatedNotes: ['1', '3'],
          retention: 0.6,
          mnemonicType: 'memoryPalace'
        },
        {
          id: '5',
          title: 'Cognitive Architecture of Learning',
          content: 'A comprehensive model of learning that integrates spaced repetition, Bayesian inference, and knowledge graphs to optimize retention and understanding.',
          type: NOTE_TYPES.CONSOLIDATED,
          tags: ['Learning', 'AI', 'CognitiveScience'],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          conceptId: '5',
          courseId: 'c2',
          relatedNotes: ['1', '2', '3', '4'],
          retention: 0.9,
          mnemonicType: 'memoryPalace'
        },
        {
          id: '6',
          title: 'Chemical Bonding Fundamentals',
          content: 'Exploration of ionic, covalent, and metallic bonds and how they determine molecular properties.',
          type: NOTE_TYPES.LITERATURE,
          tags: ['Chemistry', 'Bonding', 'Molecules'],
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          conceptId: '6',
          courseId: 'c3',
          relatedNotes: [],
          retention: 0.65,
          mnemonicType: 'memoryPalace'
        },
        {
          id: '7',
          title: 'Algebraic Equations Linear Systems',
          content: 'Methods for solving systems of linear equations including substitution, elimination, and matrix approaches.',
          type: NOTE_TYPES.PERMANENT,
          tags: ['Algebra', 'Equations', 'LinearSystems'],
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          conceptId: '7',
          courseId: 'c4',
          relatedNotes: [],
          retention: 0.78,
          mnemonicType: 'storyMethod'
        }
      ]
      
      setNotes(mockNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch courses
  const fetchCourses = async () => {
    try {
      // In a real app, fetch from API
      // const response = await fetch('/api/courses')
      // if (!response.ok) throw new Error('Failed to fetch courses')
      // const data = await response.json()
      // setCourses(data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const mockCourses = [
        { id: 'c1', title: 'Learning Science', slug: 'learning-science', description: 'The science of how we learn' },
        { id: 'c2', title: 'Cognitive Psychology', slug: 'cognitive-psychology', description: 'Study of mental processes' },
        { id: 'c3', title: 'Chemistry', slug: 'chemistry', description: 'Study of matter and its interactions' },
        { id: 'c4', title: 'Algebra I', slug: 'algebra-i', description: 'Fundamentals of algebraic thinking' }
      ]
      
      setCourses(mockCourses)
      setCurrentCourse(mockCourses[0]) // Set first course as default
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }
  
  // Fetch concepts
  const fetchConcepts = async () => {
    try {
      // In a real app, fetch from API
      // const response = await fetch('/api/concepts')
      // if (!response.ok) throw new Error('Failed to fetch concepts')
      // const data = await response.json()
      // setConcepts(data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock concepts data
      const mockConcepts = [
        { id: '1', name: 'Dynamic Bayesian Networks', description: 'Probabilistic graphical models that represent random variables across time' },
        { id: '2', name: 'Knowledge Management', description: 'Systems and practices for organizing and utilizing information effectively' },
        { id: '3', name: 'Learning Science', description: 'Scientific study of how people learn and the strategies that improve learning outcomes' },
        { id: '4', name: 'Cognitive Models', description: 'Computational representations of human cognitive processes' },
        { id: '5', name: 'Educational Technology', description: 'Tools and systems designed to enhance educational experiences' },
        { id: '6', name: 'Chemical Bonding', description: 'The process by which atoms form chemical bonds with other atoms' },
        { id: '7', name: 'Linear Algebra', description: 'Branch of mathematics concerning linear equations and mappings' }
      ]
      
      setConcepts(mockConcepts)
    } catch (error) {
      console.error('Error fetching concepts:', error)
    }
  }
  
  // Fetch digital twin data
  const fetchDigitalTwinData = async () => {
    try {
      // In a real app, fetch from API
      // const response = await fetch('/api/digital-twin')
      // if (!response.ok) throw new Error('Failed to fetch digital twin data')
      // const data = await response.json()
      // setRetentionScore(data.retentionScore)
      // setUnderstandingScore(data.understandingScore)
      // setConceptConnections(data.conceptConnections)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700))
      
      // Mock digital twin data
      setRetentionScore(0.72)
      setUnderstandingScore(0.68)
      
      const mockConceptConnections = [
        { source: '1', target: '4', strength: 0.8 },
        { source: '2', target: '3', strength: 0.9 },
        { source: '3', target: '5', strength: 0.7 },
        { source: '4', target: '5', strength: 0.85 },
        { source: '1', target: '3', strength: 0.6 }
      ]
      
      setConceptConnections(mockConceptConnections)
    } catch (error) {
      console.error('Error fetching digital twin data:', error)
    }
  }
  
  // Create new note
  const createNote = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      alert('Please fill in all required fields')
      return
    }
    
    try {
      // Process tags string into an array
      const tagsArray = newNoteTags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
      
      // Prepare new note data
      const newNote = {
        id: `temp-${Date.now()}`, // Temporary ID until saved to DB
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        type: newNoteType,
        tags: tagsArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        conceptId: null, // To be assigned
        courseId: currentCourse?.id,
        relatedNotes: selectedRelatedNotes,
        retention: newNoteType === NOTE_TYPES.FLEETING ? 0.2 :
                   newNoteType === NOTE_TYPES.LITERATURE ? 0.5 :
                   newNoteType === NOTE_TYPES.PERMANENT ? 0.75 :
                   newNoteType === NOTE_TYPES.BRIDGE ? 0.7 :
                   0.9, // Consolidated
        mnemonicType: null // Will be set when memory structure is chosen
      }
      
      // In a real implementation, save to API
      // const response = await fetch('/api/notes/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newNote)
      // })
      // if (!response.ok) throw new Error('Failed to create note')
      // const savedNote = await response.json()
      
      // For now, just add to state
      setNotes(prev => [newNote, ...prev])
      
      // Reset form
      setNewNoteTitle('')
      setNewNoteContent('')
      setNewNoteTags('')
      setNewNoteType(NOTE_TYPES.FLEETING)
      setSelectedRelatedNotes([])
      
      // Close dialog
      setIsCreatingNote(false)
      
    } catch (error) {
      console.error('Error creating note:', error)
      alert('Failed to create note. Please try again.')
    }
  }
  
  // Find related notes based on content similarity
  const findRelatedNotes = useCallback(debounce((content) => {
    if (!content.trim() || content.length < 15 || !notes.length) return
    
    // Simple implementation - in a real app, use NLP/vector similarity
    const contentLower = content.toLowerCase()
    const words = contentLower.split(/\s+/).filter(word => word.length > 4)
    
    if (words.length < 2) return
    
    const related = notes.filter(note => {
      const noteLower = (note.title + ' ' + note.content).toLowerCase()
      // Check if any significant words from content appear in the note
      return words.some(word => noteLower.includes(word))
    }).slice(0, 5) // Limit to 5 suggestions
    
    setRelatedNotes(related)
  }, 500), [notes])
  
  // Call findRelatedNotes when newNoteContent changes
  useEffect(() => {
    findRelatedNotes(newNoteContent)
  }, [newNoteContent, findRelatedNotes])
  
  // Utility function for debounce
  function debounce(func, delay) {
    let timeout
    return function(...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), delay)
    }
  }
  
  // Toggle a tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    )
  }
  
  // Toggle a related note selection
  const toggleRelatedNote = (noteId) => {
    setSelectedRelatedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId) 
        : [...prev, noteId]
    )
  }
  
  // Update a note's type (promote/demote)
  const updateNoteType = async (noteId, newType) => {
    try {
      // In a real implementation, update via API
      // const response = await fetch(`/api/notes/update/${noteId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: newType })
      // })
      // if (!response.ok) throw new Error('Failed to update note')
      
      // For now, update in state
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, type: newType } : note
      ))
      
    } catch (error) {
      console.error('Error updating note:', error)
      alert('Failed to update note type. Please try again.')
    }
  }
  
  // Delete a note
  const deleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    try {
      // In a real implementation, delete via API
      // const response = await fetch(`/api/notes/delete/${noteId}`, {
      //   method: 'DELETE'
      // })
      // if (!response.ok) throw new Error('Failed to delete note')
      
      // For now, update in state
      setNotes(prev => prev.filter(note => note.id !== noteId))
      
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Failed to delete note. Please try again.')
    }
  }
  
  // Apply a memory structure to a note
  const applyMemoryStructure = async (noteId, structureType) => {
    try {
      // In a real implementation, update via API
      // const response = await fetch(`/api/notes/memory-structure/${noteId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ structureType })
      // })
      // if (!response.ok) throw new Error('Failed to apply memory structure')
      
      // For now, update in state
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, mnemonicType: structureType } : note
      ))
      
    } catch (error) {
      console.error('Error applying memory structure:', error)
      alert('Failed to apply memory structure. Please try again.')
    }
  }
  
  // Convert timestamp to relative time string
  const getRelativeTimeString = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    
    return date.toLocaleDateString()
  }
  
  // Basic authentication check
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="glassmorphism rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Zettelkasten Notebook</h1>
            <p className="text-muted-foreground">
              Your personal knowledge warehouse and digital twin learning model
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full rounded-md bg-card border border-accent-border focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search 
                className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
              />
            </div>
            
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition flex items-center justify-center" 
              onClick={() => setIsCreatingNote(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              New Note
            </button>
          </div>
        </div>
      </div>
      
      {/* Course Selection */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <div className="text-sm font-medium text-slate-600 mr-2">Course:</div>
        {courses.map(course => (
          <button
            key={course.id}
            className={`px-3 py-1.5 text-sm rounded-md transition whitespace-nowrap ${
              currentCourse?.id === course.id 
                ? 'bg-primary text-white' 
                : 'bg-card hover:bg-card/80'
            }`}
            onClick={() => setCurrentCourse(course)}
          >
            {course.title}
          </button>
        ))}
        <button
          className={`px-3 py-1.5 text-sm rounded-md transition ${
            !currentCourse ? 'bg-primary text-white' : 'bg-card hover:bg-card/80'
          }`}
          onClick={() => setCurrentCourse(null)}
        >
          All Courses
        </button>
      </div>
      
      {/* Digital Twin Learning Model Summary */}
      <div className="glassmorphism rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-bold mb-2 md:mb-0 flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            Digital Twin Learning Model
          </h2>
          <div className="flex space-x-4">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${showRetentionHints ? 'bg-primary text-white' : 'bg-card hover:bg-card/80'} transition`}
              onClick={() => setShowRetentionHints(!showRetentionHints)}
            >
              {showRetentionHints ? 'Hide Retention Hints' : 'Show Retention Hints'}
            </button>
            <Link 
              href="/notebook/graph" 
              className="px-3 py-1 rounded-md text-sm bg-card hover:bg-card/80 transition flex items-center"
            >
              <Network className="h-4 w-4 mr-1" />
              View Knowledge Graph
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Knowledge Retention</h3>
              <span className="text-sm">
                {Math.round(retentionScore * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.round(retentionScore * 100)}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your knowledge retention is {retentionScore > 0.8 ? 'excellent' : retentionScore > 0.6 ? 'good' : 'developing'}.
              {retentionScore < 0.7 ? ' Create more permanent notes to improve retention.' : ''}
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Concept Understanding</h3>
              <span className="text-sm">
                {Math.round(understandingScore * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.round(understandingScore * 100)}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your conceptual understanding is {understandingScore > 0.8 ? 'excellent' : understandingScore > 0.6 ? 'good' : 'developing'}.
              {understandingScore < 0.7 ? ' Create more bridge notes to connect concepts.' : ''}
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Note Type Distribution</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.values(NOTE_TYPES).map(type => {
              const typeInfo = NOTE_TYPE_INFO[type]
              const noteCount = notes.filter(note => note.type === type).length
              const percentage = notes.length ? (noteCount / notes.length) * 100 : 0
              
              return (
                <div 
                  key={type}
                  className={`rounded-lg p-3 border border-${type}-300 cursor-pointer transition hover:shadow-md`}
                  style={{ 
                    borderColor: typeInfo.color,
                    backgroundColor: `${typeInfo.color}10`
                  }}
                  onClick={() => setActiveType(prevType => prevType === type ? 'all' : type)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl" role="img" aria-label={type}>{typeInfo.icon}</span>
                    <span className="text-xs font-medium" style={{ color: typeInfo.color }}>{Math.round(percentage)}%</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{typeInfo.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Retention: {typeInfo.retention}</span>
                    <span className="text-xs font-bold">{noteCount}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Memory Structure Preferences */}
      <div className="glassmorphism rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-bold mb-2 md:mb-0 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Memory Structures
          </h2>
          <Link 
            href="/noospace" 
            className="px-3 py-1 rounded-md text-sm bg-card hover:bg-card/80 transition flex items-center"
          >
            <Network className="h-4 w-4 mr-1" />
            Go to Noospace
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center mb-3">
              <LinkIcon className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-medium text-purple-800">Story Method</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Create a narrative flow linking concepts sequentially, like items in a linked list. Best for processes and sequences.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-700">
                {notes.filter(n => n.mnemonicType === 'storyMethod').length} notes
              </span>
              <button className="text-primary hover:underline">
                Create New
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-blue-800">Memory Palace</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Spatially organize knowledge by associating concepts with specific locations in an imagined structure.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                {notes.filter(n => n.mnemonicType === 'memoryPalace').length} notes
              </span>
              <button className="text-primary hover:underline">
                Create New
              </button>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center mb-3">
              <Network className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-green-800">Concept Map</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Visualize relationships between concepts as a network graph. Perfect for complex interconnected knowledge.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">
                {notes.filter(n => n.mnemonicType === 'conceptMap').length} notes
              </span>
              <button className="text-primary hover:underline">
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Note Navigation and Filtering */}
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 mb-6">
        <div className="flex space-x-1 bg-card rounded-md p-1 w-fit">
          <button 
            className={`px-3 py-1.5 text-sm rounded-md transition ${activeType === 'all' ? 'bg-primary text-white' : 'hover:bg-card/80'}`}
            onClick={() => setActiveType('all')}
          >
            All Notes
          </button>
          {Object.values(NOTE_TYPES).map(type => (
            <button 
              key={type}
              className={`px-3 py-1.5 text-sm rounded-md transition flex items-center ${activeType === type ? 'bg-primary text-white' : 'hover:bg-card/80'}`}
              onClick={() => setActiveType(prevType => prevType === type ? 'all' : type)}
            >
              <span className="mr-1">{NOTE_TYPE_INFO[type].icon}</span>
              <span className="hidden sm:inline">{NOTE_TYPE_INFO[type].name}</span>
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1.5 rounded-md text-sm transition flex items-center ${activeView === 'cards' ? 'bg-primary text-white' : 'bg-card hover:bg-card/80'}`}
            onClick={() => setActiveView('cards')}
          >
            <div className="grid grid-cols-2 gap-0.5 h-4 w-4 mr-1">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
            Cards
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md text-sm transition flex items-center ${activeView === 'list' ? 'bg-primary text-white' : 'bg-card hover:bg-card/80'}`}
            onClick={() => setActiveView('list')}
          >
            <div className="flex flex-col h-4 w-4 mr-1 justify-between">
              <div className="h-0.5 w-full bg-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current rounded-full"></div>
            </div>
            List
          </button>
        </div>
      </div>
      
      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedTags.includes(tag) 
                    ? 'bg-primary text-white' 
                    : 'bg-card hover:bg-card/80'
                }`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Notes Display */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="glassmorphism rounded-lg p-10 text-center">
          <LightbulbIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-6">
            {activeType !== 'all' 
              ? `You don't have any ${NOTE_TYPE_INFO[activeType].name.toLowerCase()} yet.` 
              : selectedTags.length > 0 
                ? 'No notes match the selected tags.' 
                : searchTerm 
                  ? `No notes match the search term "${searchTerm}".` 
                  : "You haven't created any notes yet."}
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
            onClick={() => {
              setActiveType('all')
              setSelectedTags([])
              setSearchTerm('')
              setIsCreatingNote(true)
            }}
          >
            Create your first note
          </button>
        </div>
      ) : (
        <div className={activeView === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
          {filteredNotes.map(note => {
            const typeInfo = NOTE_TYPE_INFO[note.type]
            const relatedNoteCount = note.relatedNotes.length
            
            // Find concept name
            const concept = concepts.find(c => c.id === note.conceptId)
            
            // Find course name
            const course = courses.find(c => c.id === note.courseId)
            
            // Memory structure badge
            const memoryStructureBadge = note.mnemonicType ? (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                note.mnemonicType === 'storyMethod' 
                  ? 'bg-purple-100 text-purple-800' 
                  : note.mnemonicType === 'memoryPalace'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {note.mnemonicType === 'storyMethod' ? 'Story Method' : 
                 note.mnemonicType === 'memoryPalace' ? 'Memory Palace' : 
                 'Concept Map'}
              </span>
            ) : null
            
            return activeView === 'cards' ? (
              <div 
                key={note.id}
                className={`glassmorphism rounded-lg p-5 transition hover:shadow-lg relative ${
                  showRetentionHints ? 'border-l-4' : ''
                }`}
                style={showRetentionHints ? { borderLeftColor: typeInfo.color } : {}}
              >
                {/* Note type indicator and actions */}
                <div className="flex justify-between items-start mb-3">
                  <div 
                    className="flex items-center text-sm font-medium"
                    style={{ color: typeInfo.color }}
                  >
                    <span className="mr-1">{typeInfo.icon}</span>
                    {typeInfo.name}
                  </div>
                  
                  <div className="flex space-x-1">
                    {/* Memory Structure button */}
                    <div className="relative group">
                      <button 
                        className="p-1 text-gray-400 hover:text-primary transition rounded-md"
                        title="Apply Memory Structure"
                      >
                        <Brain className="h-4 w-4" />
                      </button>
                      
                      {/* Dropdown for memory structure selection */}
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                        <div className="py-1">
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => applyMemoryStructure(note.id, 'storyMethod')}
                          >
                            <LinkIcon className="h-4 w-4 mr-2 text-purple-600" />
                            Story Method
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => applyMemoryStructure(note.id, 'memoryPalace')}
                          >
                            <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                            Memory Palace
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => applyMemoryStructure(note.id, 'conceptMap')}
                          >
                            <Network className="h-4 w-4 mr-2 text-green-600" />
                            Concept Map
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Promote button if not at highest level */}
                    {typeInfo.nextStep && (
                      <button 
                        className="p-1 text-gray-400 hover:text-primary transition rounded-md"
                        onClick={() => updateNoteType(note.id, typeInfo.nextStep)}
                        title={`Promote to ${NOTE_TYPE_INFO[typeInfo.nextStep].name}`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </button>
                    )}
                    
                    {/* Edit button */}
                    <button 
                      className="p-1 text-gray-400 hover:text-primary transition rounded-md"
                      onClick={() => alert('Edit feature coming soon')}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    {/* Delete button */}
                    <button 
                      className="p-1 text-gray-400 hover:text-red-500 transition rounded-md"
                      onClick={() => deleteNote(note.id)}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Note content */}
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{note.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{note.content}</p>
                
                {/* Memory structure badge */}
                {memoryStructureBadge && (
                  <div className="mb-3">
                    {memoryStructureBadge}
                  </div>
                )}
                
                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 bg-card text-xs rounded-full cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
                  <div className="flex flex-wrap gap-1">
                    {concept && (
                      <span className="flex items-center">
                        <BrainCircuit className="h-3 w-3 mr-1 text-primary" />
                        {concept.name}
                      </span>
                    )}
                    {course && (
                      <span className="flex items-center ml-2">
                        <BookOpen className="h-3 w-3 mr-1 text-primary" />
                        {course.title}
                      </span>
                    )}
                    {relatedNoteCount > 0 && (
                      <span className="flex items-center ml-2">
                        <LinkIcon className="h-3 w-3 mr-1 text-primary" />
                        {relatedNoteCount}
                      </span>
                    )}
                  </div>
                  <span>{getRelativeTimeString(note.updatedAt)}</span>
                </div>
                
                {/* Retention indicator */}
                {showRetentionHints && (
                  <div className="absolute top-2 right-2">
                    <div className="tooltip" data-tip={`Retention: ${Math.round(note.retention * 100)}%`}>
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ 
                          backgroundColor: note.retention > 0.8 ? 'green' : 
                                          note.retention > 0.6 ? '#d97706' : 
                                          'red' 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* List view */
              <div 
                key={note.id}
                className={`glassmorphism rounded-lg p-4 transition hover:shadow-lg flex flex-col md:flex-row md:items-center gap-3 ${
                  showRetentionHints ? 'border-l-4' : ''
                }`}
                style={showRetentionHints ? { borderLeftColor: typeInfo.color } : {}}
              >
                <div className="flex-shrink-0 flex md:flex-col items-center md:items-start">
                  <div 
                    className="text-sm font-medium flex items-center"
                    style={{ color: typeInfo.color }}
                  >
                    <span className="mr-1">{typeInfo.icon}</span>
                    <span className="hidden md:inline">{typeInfo.name}</span>
                  </div>
                  
                  {showRetentionHints && (
                    <div className="tooltip ml-3 md:ml-0 md:mt-2" data-tip={`Retention: ${Math.round(note.retention * 100)}%`}>
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ 
                          backgroundColor: note.retention > 0.8 ? 'green' : 
                                          note.retention > 0.6 ? '#d97706' : 
                                          'red' 
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-base font-bold line-clamp-1">{note.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{note.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {/* Memory structure badge */}
                    {memoryStructureBadge}
                    
                    {/* Tags */}
                    {note.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 bg-card text-xs rounded-full cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-card text-xs rounded-full">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto md:shrink-0">
                  <div className="text-xs text-muted-foreground">
                    {getRelativeTimeString(note.updatedAt)}
                  </div>
                  
                  <div className="flex space-x-1">
                    {/* Memory Structure Button */}
                    <div className="relative group">
                      <button 
                        className="p-1 text-gray-400 hover:text-primary transition rounded-md"
                        title="Apply Memory Structure"
                      >
                        <Brain className="h-4 w-4" />
                      </button>
                      
                      {/* Dropdown for memory structure selection */}
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                        <div className="py-1">
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => applyMemoryStructure(note.id, 'storyMethod')}
                          >
                            <LinkIcon className="h-4 w-4 mr-2 text-purple-600" />
                            Story Method
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => applyMemoryStructure(note.id, 'memoryPalace')}
                          >
                            <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                            Memory Palace
                          </button>
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => applyMemoryStructure(note.id, 'conceptMap')}
                          >
                            <Network className="h-4 w-4 mr-2 text-green-600" />
                            Concept Map
                          </button>
                        </div>
                      </div>
                    </div>
                  
                    {/* Promote button if not at highest level */}
                    {typeInfo.nextStep && (
                      <button 
                        className="p-1 text-gray-400 hover:text-primary transition rounded-md"
                        onClick={() => updateNoteType(note.id, typeInfo.nextStep)}
                        title={`Promote to ${NOTE_TYPE_INFO[typeInfo.nextStep].name}`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </button>
                    )}
                    
                    <button 
                      className="p-1 text-gray-400 hover:text-primary transition rounded-md"
                      onClick={() => alert('Edit feature coming soon')}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    <button 
                      className="p-1 text-gray-400 hover:text-red-500 transition rounded-md"
                      onClick={() => deleteNote(note.id)}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* New Note Dialog */}
      {isCreatingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsCreatingNote(false)}
          ></div>
          
          <div 
            className="glassmorphism rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto z-10"
            ref={newNoteDialogRef}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Create New Note</h2>
                <button 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsCreatingNote(false)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={createNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Note Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {Object.values(NOTE_TYPES).map(type => {
                      const typeInfo = NOTE_TYPE_INFO[type]
                      
                      return (
                        <button
                          key={type}
                          type="button"
                          className={`p-2 rounded-md text-xs text-center transition flex flex-col items-center ${
                            newNoteType === type 
                              ? 'ring-2 ring-primary'
                              : 'hover:bg-card'
                          }`}
                          style={{ backgroundColor: `${typeInfo.color}10` }}
                          onClick={() => setNewNoteType(type)}
                        >
                          <span className="text-lg mb-1">{typeInfo.icon}</span>
                          <span className="font-medium">{typeInfo.name}</span>
                        </button>
                      )
                    })}
                  </div>
                  
                  <p className="mt-2 text-xs text-muted-foreground">
                    {NOTE_TYPE_INFO[newNoteType].description}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-card border border-accent-border focus:border-primary focus:outline-none"
                    placeholder="Enter note title..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    className="w-full p-3 rounded-lg bg-card border border-accent-border focus:border-primary focus:outline-none min-h-[120px]"
                    placeholder="Enter note content..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-card border border-accent-border focus:border-primary focus:outline-none"
                    placeholder="learning, notes, zettelkasten..."
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Course</label>
                  <select
                    className="w-full p-3 rounded-lg bg-card border border-accent-border focus:border-primary focus:outline-none"
                    value={currentCourse?.id || ''}
                    onChange={(e) => {
                      const courseId = e.target.value
                      setCurrentCourse(courses.find(c => c.id === courseId) || null)
                    }}
                  >
                    <option value="">No Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                
                {/* Related Notes */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium">Related Notes</label>
                    <span className="text-xs text-muted-foreground">
                      {selectedRelatedNotes.length} selected
                    </span>
                  </div>
                  
                  {relatedNotes.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-card rounded-lg p-2">
                      {relatedNotes.map(related => (
                        <div 
                          key={related.id}
                          className={`p-2 rounded-md transition cursor-pointer ${
                            selectedRelatedNotes.includes(related.id)
                              ? 'bg-primary/20 ring-1 ring-primary'
                              : 'hover:bg-card/80'
                          }`}
                          onClick={() => toggleRelatedNote(related.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium line-clamp-1">{related.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{related.content}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs mr-1">{NOTE_TYPE_INFO[related.type].icon}</span>
                              <input 
                                type="checkbox" 
                                className="rounded border-accent-border"
                                checked={selectedRelatedNotes.includes(related.id)}
                                onChange={() => toggleRelatedNote(related.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground bg-card rounded-lg p-3">
                      No related notes found. As you write, we'll suggest connections.
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end pt-4 border-t border-border">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-card hover:bg-card/80 mr-2"
                    onClick={() => setIsCreatingNote(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
                  >
                    Create Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}