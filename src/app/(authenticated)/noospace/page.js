'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Brain, BrainCircuit, Network, BookOpen, 
  LightbulbIcon, Filter, Search, Plus, Link as LinkIcon,
  Box, Boxes, Focus, Grid3X3, Workflow, Map, Building2,
  Layers, CornerDownRight, Bookmark, Eye, EyeOff
} from 'lucide-react'
import RotateCw from 'lucide-react/dist/esm/icons/rotate-cw'
import ZoomIn from 'lucide-react/dist/esm/icons/zoom-in'
import ZoomOut from 'lucide-react/dist/esm/icons/zoom-out'
import { NOTE_TYPES } from '../notebook/page'

export default function NooSpace() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const loading = status === 'loading'
  
  // States for visualization
  const [viewType, setViewType] = useState('3d') // '3d' or '2d'
  const [zoomLevel, setZoomLevel] = useState(1)
  const [activeMemoryRegion, setActiveMemoryRegion] = useState('all') // 'all', 'shortTerm', 'longTerm'
  const [showLabels, setShowLabels] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [activeClasses, setActiveClasses] = useState([])
  
  // States for data
  const [memoryStructures, setMemoryStructures] = useState([])
  const [notes, setNotes] = useState([])
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Canvas ref
  const canvasRef = useRef(null)
  
  useEffect(() => {
    if (session?.user?.id) {
      fetchData()
    }
  }, [session])
  
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls
      await Promise.all([fetchNotes(), fetchMemoryStructures(), fetchCourses()])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const fetchNotes = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock notes data
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
        },
        {
          id: '4',
          title: 'Cognitive Load Theory',
          content: 'Framework explaining how cognitive load affects learning and memory formation.',
          type: NOTE_TYPES.LITERATURE,
          tags: ['CognitiveScience', 'LearningTheory'],
          courseId: 'c2',
          mnemonicType: null,
          retention: 0.45,
          region: 'shortTerm',
          position: { x: 90, y: 40, z: 20 }
        },
        {
          id: '5',
          title: 'Neural Network Analogy',
          content: 'Comparing memory formation to neural networks with nodes and weighted connections.',
          type: NOTE_TYPES.BRIDGE,
          tags: ['AI', 'Neuroscience', 'MemoryModels'],
          courseId: 'c3',
          mnemonicType: 'conceptMap',
          retention: 0.72,
          region: 'longTerm',
          position: { x: 60, y: 70, z: 40 }
        }
      ]
      
      setNotes(mockNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }
  
  const fetchMemoryStructures = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock memory structures
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
        },
        {
          id: 's3',
          name: 'Chemistry Concept Network',
          type: 'conceptMap',
          courseId: 'c3',
          nodes: 15,
          connections: 23,
          lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          region: 'shortTerm',
          position: { x: 80, y: 60, z: 70 }
        },
        {
          id: 's4',
          name: 'Cognitive Psychology Building',
          type: 'memoryPalace',
          courseId: 'c2',
          nodes: 10,
          connections: 14,
          lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          region: 'shortTerm',
          position: { x: 120, y: 40, z: 60 }
        }
      ]
      
      setMemoryStructures(mockStructures)
    } catch (error) {
      console.error('Error fetching memory structures:', error)
    }
  }
  
  const fetchCourses = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock courses
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
  
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }
  
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
  
  // Authentication check
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold">Loading Noospace...</h2>
          <p className="text-muted-foreground">Preparing your thought warehouse</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Noospace
          </h1>
          <p className="text-sm text-muted-foreground">
            Administrative thought warehouse
          </p>
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
        
        {/* Structure Types */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-900 mb-2">Structure Types</h3>
          <div className="space-y-1">
            <div className="flex items-center px-3 py-2 text-sm">
              <Building2 className="h-4 w-4 mr-2 text-blue-600" />
              <span>Memory Palace</span>
              <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {memoryStructures.filter(s => s.type === 'memoryPalace').length}
              </span>
            </div>
            <div className="flex items-center px-3 py-2 text-sm">
              <Workflow className="h-4 w-4 mr-2 text-purple-600" />
              <span>Story Method</span>
              <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                {memoryStructures.filter(s => s.type === 'storyMethod').length}
              </span>
            </div>
            <div className="flex items-center px-3 py-2 text-sm">
              <Network className="h-4 w-4 mr-2 text-green-600" />
              <span>Concept Map</span>
              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {memoryStructures.filter(s => s.type === 'conceptMap').length}
              </span>
            </div>
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
            href="/notebook"
            className="block text-center py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            Return to Notebook
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
              {activeMemoryRegion === 'all' 
                ? 'All Memory Regions' 
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
        
        {/* 3D visualization placeholder */}
        <div 
          className="h-full w-full bg-gradient-to-br from-slate-50 to-blue-50"
          ref={canvasRef}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {viewType === '3d' ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative w-full h-full">
                {/* Brain-like background structure */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-100 rounded-[80%] opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-indigo-100 rounded-[60%] rotate-45 opacity-20"></div>
                
                {/* Short-term memory region - top area */}
                <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[350px] h-[150px] flex items-center justify-center">
                  {activeMemoryRegion !== 'longTerm' && (
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-500 bg-white/80 px-2 py-1 rounded-md shadow-sm">
                        Short-term Memory
                      </div>
                      <div className="w-full h-full bg-blue-50 rounded-full border-2 border-blue-100 opacity-30">
                      </div>
                      
                      {/* Short-term structures */}
                      {filteredStructures
                        .filter(s => s.region === 'shortTerm')
                        .map(structure => (
                          <div 
                            key={structure.id}
                            className="absolute cursor-pointer transform transition-all hover:scale-110"
                            style={{ 
                              top: `${structure.position.y * 1.2}px`, 
                              left: `${structure.position.x * 1.2}px`,
                              zIndex: structure.position.z
                            }}
                          >
                            <div 
                              className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md ${
                                structure.type === 'memoryPalace' ? 'bg-blue-100 text-blue-700' :
                                structure.type === 'storyMethod' ? 'bg-purple-100 text-purple-700' :
                                'bg-green-100 text-green-700'
                              }`}
                            >
                              {renderMemoryStructureIcon(structure.type)}
                            </div>
                            {showLabels && (
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap bg-white text-[10px] px-1 py-0.5 rounded shadow-sm">
                                {structure.name}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                
                {/* Long-term memory region - bottom area */}
                <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 w-[500px] h-[200px] flex items-center justify-center">
                  {activeMemoryRegion !== 'shortTerm' && (
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-500 bg-white/80 px-2 py-1 rounded-md shadow-sm">
                        Long-term Memory
                      </div>
                      <div className="w-full h-full bg-indigo-50 rounded-full border-2 border-indigo-100 opacity-30">
                      </div>
                      
                      {/* Long-term structures */}
                      {filteredStructures
                        .filter(s => s.region === 'longTerm')
                        .map(structure => (
                          <div 
                            key={structure.id}
                            className="absolute cursor-pointer transform transition-all hover:scale-110"
                            style={{ 
                              top: `${structure.position.y * 1.5}px`, 
                              left: `${structure.position.x * 1.2}px`,
                              zIndex: structure.position.z
                            }}
                          >
                            <div 
                              className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-md ${
                                structure.type === 'memoryPalace' ? 'bg-blue-200 text-blue-700' :
                                structure.type === 'storyMethod' ? 'bg-purple-200 text-purple-700' :
                                'bg-green-200 text-green-700'
                              }`}
                            >
                              {renderMemoryStructureIcon(structure.type)}
                            </div>
                            {showLabels && (
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap bg-white text-[10px] px-1 py-0.5 rounded shadow-sm">
                                {structure.name}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                
                {/* Connections between regions */}
                {showConnections && activeMemoryRegion === 'all' && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                      <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="10" strokeDasharray="15,10" />
                      <line x1="45%" y1="25%" x2="35%" y2="75%" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="6" strokeDasharray="10,8" />
                      <line x1="55%" y1="25%" x2="65%" y2="75%" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="6" strokeDasharray="10,8" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full w-full overflow-hidden p-8">
              <div className="grid grid-cols-2 gap-6 h-full">
                {/* Short-term memory section */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 overflow-auto">
                  <h3 className="font-medium mb-4 text-center">Short-term Memory</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {filteredStructures
                      .filter(s => s.region === 'shortTerm')
                      .map(structure => (
                        <div 
                          key={structure.id}
                          className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                          <div className="flex items-center mb-2">
                            <div 
                              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                structure.type === 'memoryPalace' ? 'bg-blue-100 text-blue-700' :
                                structure.type === 'storyMethod' ? 'bg-purple-100 text-purple-700' :
                                'bg-green-100 text-green-700'
                              }`}
                            >
                              {renderMemoryStructureIcon(structure.type)}
                            </div>
                            <div className="ml-2">
                              <h4 className="font-medium text-sm">{structure.name}</h4>
                              <p className="text-xs text-slate-500">
                                {courses.find(c => c.id === structure.courseId)?.title}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-slate-500">
                            <div className="flex items-center">
                              <Network className="h-3 w-3 mr-1" />
                              {structure.nodes} nodes
                            </div>
                            <div>{new Date(structure.lastModified).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                      
                    {filteredNotes
                      .filter(note => note.region === 'shortTerm')
                      .map(note => (
                        <div 
                          key={note.id}
                          className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-slate-300 hover:shadow-md transition cursor-pointer"
                        >
                          <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2">{note.content}</p>
                          
                          {note.mnemonicType && (
                            <div className="mt-1">
                              <span 
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                  note.mnemonicType === 'storyMethod' ? 'bg-purple-100 text-purple-800' : 
                                  note.mnemonicType === 'memoryPalace' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-green-100 text-green-800'
                                }`}
                              >
                                {note.mnemonicType === 'storyMethod' ? 'Story Method' : 
                                note.mnemonicType === 'memoryPalace' ? 'Memory Palace' : 
                                'Concept Map'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                    {filteredStructures.filter(s => s.region === 'shortTerm').length === 0 && 
                     filteredNotes.filter(n => n.region === 'shortTerm').length === 0 && (
                      <div className="text-center py-8">
                        <Focus className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No short-term memory items for selected filters</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Long-term memory section */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 overflow-auto">
                  <h3 className="font-medium mb-4 text-center">Long-term Memory</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {filteredStructures
                      .filter(s => s.region === 'longTerm')
                      .map(structure => (
                        <div 
                          key={structure.id}
                          className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                          <div className="flex items-center mb-2">
                            <div 
                              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                structure.type === 'memoryPalace' ? 'bg-blue-100 text-blue-700' :
                                structure.type === 'storyMethod' ? 'bg-purple-100 text-purple-700' :
                                'bg-green-100 text-green-700'
                              }`}
                            >
                              {renderMemoryStructureIcon(structure.type)}
                            </div>
                            <div className="ml-2">
                              <h4 className="font-medium text-sm">{structure.name}</h4>
                              <p className="text-xs text-slate-500">
                                {courses.find(c => c.id === structure.courseId)?.title}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-slate-500">
                            <div className="flex items-center">
                              <Network className="h-3 w-3 mr-1" />
                              {structure.nodes} nodes
                            </div>
                            <div>{new Date(structure.lastModified).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                      
                    {filteredNotes
                      .filter(note => note.region === 'longTerm')
                      .map(note => (
                        <div 
                          key={note.id}
                          className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-slate-300 hover:shadow-md transition cursor-pointer"
                        >
                          <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2">{note.content}</p>
                          
                          {note.mnemonicType && (
                            <div className="mt-1">
                              <span 
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                  note.mnemonicType === 'storyMethod' ? 'bg-purple-100 text-purple-800' : 
                                  note.mnemonicType === 'memoryPalace' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-green-100 text-green-800'
                                }`}
                              >
                                {note.mnemonicType === 'storyMethod' ? 'Story Method' : 
                                note.mnemonicType === 'memoryPalace' ? 'Memory Palace' : 
                                'Concept Map'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                    {filteredStructures.filter(s => s.region === 'longTerm').length === 0 && 
                     filteredNotes.filter(n => n.region === 'longTerm').length === 0 && (
                      <div className="text-center py-8">
                        <Bookmark className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No long-term memory items for selected filters</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}