'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Brain, BrainCircuit, Network, BookOpen, 
  LightbulbIcon, Filter, Search, ArrowLeft,
  Box, Boxes, Focus, Building2,
  Layers, CornerDownRight, Bookmark, Eye
} from 'lucide-react'
import RotateCw from 'lucide-react/dist/esm/icons/rotate-cw'
import ZoomIn from 'lucide-react/dist/esm/icons/zoom-in'
import ZoomOut from 'lucide-react/dist/esm/icons/zoom-out'
import { NOTE_TYPES } from '../../notebook/page'

export default function StaffNoospaceView({ params }) {
  const { userId } = params
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === 'loading'
  
  // States for user info
  const [userData, setUserData] = useState(null)
  
  // States for visualization (same as in the regular noospace page)
  const [viewType, setViewType] = useState('3d')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [activeMemoryRegion, setActiveMemoryRegion] = useState('all')
  const [showLabels, setShowLabels] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [activeClasses, setActiveClasses] = useState([])
  
  // States for data
  const [memoryStructures, setMemoryStructures] = useState([])
  const [notes, setNotes] = useState([])
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (session?.user?.id && ['ADMIN', 'TEACHER', 'STAFF'].includes(session?.user?.role)) {
      fetchUserData()
      fetchData()
    }
  }, [session, userId])
  
  const fetchUserData = async () => {
    try {
      // This would be an API call to get the user data
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setUserData({
        id: userId,
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        role: 'STUDENT',
        enrolledCourses: 4,
        createdAt: new Date('2025-01-15'),
        lastActive: new Date('2025-03-20')
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
  
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls - in a real app these would fetch data for the specific userId
      await Promise.all([fetchNotes(), fetchMemoryStructures(), fetchCourses()])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // The rest of the data fetching functions are similar to the regular noospace page
  // but would be modified to fetch data for the specific userId
  
  const fetchNotes = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock notes data - would be fetched for the specific user
      const mockNotes = [
        {
          id: '1',
          title: 'Memory Palace Structure',
          content: 'The memory palace technique uses spatial memory to organize and recall information by associating it with familiar locations.',
          type: NOTE_TYPES.PERMANENT,
          tags: ['MemoryTechniques', 'SpatialMemory'],
          courseId: 'c1',
          mnemonicType: 'memoryPalace',
          retention: 0.85,
          region: 'longTerm',
          position: { x: 120, y: 80, z: 50 }
        },
        {
          id: '2',
          title: 'Story Method Implementation',
          content: 'Using narrative structures to create linked sequences of concepts, similar to linked lists in data structures.',
          type: NOTE_TYPES.PERMANENT,
          tags: ['MemoryTechniques', 'Narrative'],
          courseId: 'c1',
          mnemonicType: 'storyMethod',
          retention: 0.78,
          region: 'longTerm',
          position: { x: 80, y: 100, z: 70 }
        },
        {
          id: '3',
          title: 'Binary Tree Memory Structure',
          content: 'Organizing hierarchical knowledge using binary tree structures for efficient retrieval and association.',
          type: NOTE_TYPES.BRIDGE,
          tags: ['DataStructures', 'MemoryTechniques'],
          courseId: 'c2',
          mnemonicType: 'conceptMap',
          retention: 0.65,
          region: 'shortTerm',
          position: { x: 150, y: 60, z: 30 }
        }
      ]
      
      setNotes(mockNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }
  
  const fetchMemoryStructures = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock memory structures - would be fetched for the specific user
      const mockStructures = [
        {
          id: 's1',
          name: 'Learning Science Palace',
          type: 'memoryPalace',
          courseId: 'c1',
          nodes: 12,
          connections: 18,
          lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          region: 'longTerm',
          position: { x: 100, y: 100, z: 50 }
        },
        {
          id: 's2',
          name: 'Mathematics Story Chain',
          type: 'storyMethod',
          courseId: 'c4',
          nodes: 8,
          connections: 7,
          lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          region: 'longTerm',
          position: { x: 150, y: 80, z: 30 }
        }
      ]
      
      setMemoryStructures(mockStructures)
    } catch (error) {
      console.error('Error fetching memory structures:', error)
    }
  }
  
  const fetchCourses = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock courses - would be fetched for the specific user
      const mockCourses = [
        { id: 'c1', title: 'Learning Science', slug: 'learning-science' },
        { id: 'c2', title: 'Cognitive Psychology', slug: 'cognitive-psychology' },
        { id: 'c3', title: 'Chemistry', slug: 'chemistry' },
        { id: 'c4', title: 'Algebra I', slug: 'algebra-i' }
      ]
      
      setCourses(mockCourses)
      setActiveClasses([mockCourses[0].id, mockCourses[2].id]) // Set some initial active courses
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }
  
  const toggleClass = (courseId) => {
    setActiveClasses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }
  
  // Other utility functions from the regular noospace page would be included here
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3))
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  const resetView = () => {
    setZoomLevel(1)
    setActiveMemoryRegion('all')
  }
  
  // Get filtered structures based on active region and classes
  const filteredStructures = memoryStructures.filter(structure => {
    const regionMatch = activeMemoryRegion === 'all' || structure.region === activeMemoryRegion
    const classMatch = activeClasses.length === 0 || activeClasses.includes(structure.courseId)
    return regionMatch && classMatch
  })
  
  // Get filtered notes based on active region and classes
  const filteredNotes = notes.filter(note => {
    const regionMatch = activeMemoryRegion === 'all' || note.region === activeMemoryRegion
    const classMatch = activeClasses.length === 0 || activeClasses.includes(note.courseId)
    return regionMatch && classMatch
  })
  
  // Function to render appropriate icon for memory structure types
  const renderMemoryStructureIcon = (type) => {
    switch (type) {
      case 'memoryPalace':
        return <Building2 className="h-4 w-4" />
      case 'storyMethod':
        return <Workflow className="h-4 w-4" />
      case 'conceptMap':
        return <Network className="h-4 w-4" />
      default:
        return <Box className="h-4 w-4" />
    }
  }
  
  // Access control - only staff, teachers, and admins can view
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!session || !['ADMIN', 'TEACHER', 'STAFF'].includes(session?.user?.role)) {
    router.push('/dashboard')
    return null
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold">Loading Student Noospace...</h2>
          <p className="text-muted-foreground">Analyzing thought structures</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col h-full">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-primary mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-xl font-bold mb-1 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Student Noospace
          </h1>
          
          {userData && (
            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-4">
              <h3 className="font-medium text-sm">{userData.name}</h3>
              <p className="text-xs text-slate-500">{userData.email}</p>
              <div className="mt-2 text-xs">
                <div className="flex justify-between mb-1">
                  <span>Role:</span>
                  <span className="font-medium">{userData.role}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Courses:</span>
                  <span className="font-medium">{userData.enrolledCourses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Active:</span>
                  <span className="font-medium">{userData.lastActive.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Memory Region Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-900 mb-2">Memory Region</h3>
          <div className="space-y-1">
            <button 
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition ${activeMemoryRegion === 'all' ? 'bg-primary text-white' : 'hover:bg-slate-200'}`}
              onClick={() => setActiveMemoryRegion('all')}
            >
              <Boxes className="h-4 w-4 mr-2" />
              All Regions
            </button>
            <button 
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition ${activeMemoryRegion === 'shortTerm' ? 'bg-primary text-white' : 'hover:bg-slate-200'}`}
              onClick={() => setActiveMemoryRegion('shortTerm')}
            >
              <Focus className="h-4 w-4 mr-2" />
              Short-term Memory
            </button>
            <button 
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition ${activeMemoryRegion === 'longTerm' ? 'bg-primary text-white' : 'hover:bg-slate-200'}`}
              onClick={() => setActiveMemoryRegion('longTerm')}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Long-term Memory
            </button>
          </div>
        </div>
        
        {/* Courses/Classes */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-900 mb-2">Courses</h3>
          <div className="space-y-1">
            {courses.map(course => (
              <button
                key={course.id}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition ${activeClasses.includes(course.id) ? 'bg-primary text-white' : 'hover:bg-slate-200'}`}
                onClick={() => toggleClass(course.id)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {course.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* View Options */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-900 mb-2">View Options</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                View Type
              </label>
              <div className="flex rounded-md overflow-hidden">
                <button 
                  className={`px-2 py-1 text-xs ${viewType === '2d' ? 'bg-primary text-white' : 'bg-slate-200'}`}
                  onClick={() => setViewType('2d')}
                >
                  2D
                </button>
                <button 
                  className={`px-2 py-1 text-xs ${viewType === '3d' ? 'bg-primary text-white' : 'bg-slate-200'}`}
                  onClick={() => setViewType('3d')}
                >
                  3D
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Show Labels
              </label>
              <button 
                className={`w-8 h-4 rounded-full relative ${showLabels ? 'bg-primary' : 'bg-slate-300'}`}
                onClick={() => setShowLabels(!showLabels)}
              >
                <span 
                  className={`absolute top-0.5 ${showLabels ? 'right-0.5' : 'left-0.5'} w-3 h-3 rounded-full bg-white transition-all`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center">
                <CornerDownRight className="h-4 w-4 mr-2" />
                Show Connections
              </label>
              <button 
                className={`w-8 h-4 rounded-full relative ${showConnections ? 'bg-primary' : 'bg-slate-300'}`}
                onClick={() => setShowConnections(!showConnections)}
              >
                <span 
                  className={`absolute top-0.5 ${showConnections ? 'right-0.5' : 'left-0.5'} w-3 h-3 rounded-full bg-white transition-all`}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* View Controls */}
        <div className="mt-auto">
          <div className="flex justify-center gap-2 mb-2">
            <button 
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition"
              onClick={zoomIn}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button 
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition"
              onClick={zoomOut}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button 
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition"
              onClick={resetView}
              title="Reset View"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
          
          <Link 
            href="/dashboard"
            className="block text-center py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Main Visualization Area */}
      <div className="flex-1 relative">
        {/* Header info */}
        <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
          <div className="flex items-center">
            <BrainCircuit className="h-5 w-5 text-primary mr-2" />
            <h2 className="font-medium">
              {userData?.name}'s {activeMemoryRegion === 'all' 
                ? 'Memory' 
                : activeMemoryRegion === 'shortTerm' 
                  ? 'Short-term Memory' 
                  : 'Long-term Memory'}
            </h2>
            <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded-full">
              {filteredStructures.length} structures
            </span>
            <span className="ml-1 text-xs bg-slate-200 px-2 py-0.5 rounded-full">
              {filteredNotes.length} notes
            </span>
          </div>
        </div>
        
        {/* Visualization content would be similar to the regular noospace page */}
        <div 
          className="h-full w-full bg-gradient-to-br from-slate-50 to-blue-50"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {viewType === '3d' ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BrainCircuit className="h-20 w-20 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-600 mb-1">Student Cognitive Map</h3>
                <p className="text-slate-500">
                  Visualizing {userData?.name}'s knowledge structures and memory connections
                </p>
                <div className="mt-8 inline-flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-1.5"></div>
                    <span>Memory Palace</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-500 mr-1.5"></div>
                    <span>Story Method</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></div>
                    <span>Concept Map</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 2D view would be included here
            <div className="h-full w-full p-8 overflow-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-medium mb-4 text-center">Short-term Memory</h3>
                  <p className="text-center text-slate-500 py-10">Short-term memory visualization placeholder</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <h3 className="font-medium mb-4 text-center">Long-term Memory</h3>
                  <p className="text-center text-slate-500 py-10">Long-term memory visualization placeholder</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// This function is required to add the Workflow component that's used in renderMemoryStructureIcon
function Workflow(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>
  );
}