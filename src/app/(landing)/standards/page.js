'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useNav } from '@/components/navigation/NavContext'
import { useEffect } from 'react'

// Mock data for NYSED standards hierarchy
const STANDARDS_DATA = {
  'algebra-1': {
    id: 'algebra-1',
    title: 'Algebra I',
    description: 'Core concepts of algebraic thinking and problem solving',
    domains: [
      {
        id: 'alg1-n-rn',
        title: 'N-RN: The Real Number System',
        standards: [
          { id: 'n-rn.1', code: 'N-RN.1', description: 'Explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents to those values.' },
          { id: 'n-rn.2', code: 'N-RN.2', description: 'Rewrite expressions involving radicals and rational exponents using the properties of exponents.' },
          { id: 'n-rn.3', code: 'N-RN.3', description: 'Explain why the sum or product of two rational numbers is rational.' }
        ]
      },
      {
        id: 'alg1-a-sse',
        title: 'A-SSE: Seeing Structure in Expressions',
        standards: [
          { id: 'a-sse.1', code: 'A-SSE.1', description: 'Interpret expressions that represent a quantity in terms of its context.' },
          { id: 'a-sse.2', code: 'A-SSE.2', description: 'Use the structure of an expression to identify ways to rewrite it.' },
          { id: 'a-sse.3', code: 'A-SSE.3', description: 'Choose and produce an equivalent form of an expression to reveal properties of the quantity represented.' }
        ]
      },
      {
        id: 'alg1-a-cde',
        title: 'A-CED: Creating Equations',
        standards: [
          { id: 'a-ced.1', code: 'A-CED.1', description: 'Create equations and inequalities in one variable and use them to solve problems.' },
          { id: 'a-ced.2', code: 'A-CED.2', description: 'Create equations in two or more variables to represent relationships between quantities.' },
          { id: 'a-ced.3', code: 'A-CED.3', description: 'Represent constraints by equations or inequalities, and by systems of equations and/or inequalities.' }
        ]
      }
    ]
  },
  'algebra-2': {
    id: 'algebra-2',
    title: 'Algebra II',
    description: 'Advanced algebraic concepts and applications',
    domains: [
      {
        id: 'alg2-n-cn',
        title: 'N-CN: The Complex Number System',
        standards: [
          { id: 'n-cn.1', code: 'N-CN.1', description: 'Know there is a complex number i such that i² = -1, and every complex number has the form a + bi with a and b real.' },
          { id: 'n-cn.2', code: 'N-CN.2', description: 'Use the relation i² = -1 and the commutative, associative, and distributive properties to add, subtract, and multiply complex numbers.' },
          { id: 'n-cn.3', code: 'N-CN.3', description: 'Find the conjugate of a complex number; use conjugates to find moduli and quotients of complex numbers.' }
        ]
      },
      {
        id: 'alg2-a-apr',
        title: 'A-APR: Arithmetic with Polynomials & Rational Expressions',
        standards: [
          { id: 'a-apr.1', code: 'A-APR.1', description: 'Understand that polynomials form a system analogous to the integers, namely, they are closed under addition, subtraction, and multiplication.' },
          { id: 'a-apr.2', code: 'A-APR.2', description: 'Know and apply the Remainder Theorem.' },
          { id: 'a-apr.3', code: 'A-APR.3', description: 'Identify zeros of polynomials when suitable factorizations are available.' }
        ]
      }
    ]
  },
  'geometry': {
    id: 'geometry',
    title: 'Geometry',
    description: 'Study of shapes, sizes, and properties of space',
    domains: [
      {
        id: 'geo-g-co',
        title: 'G-CO: Congruence',
        standards: [
          { id: 'g-co.1', code: 'G-CO.1', description: 'Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment.' },
          { id: 'g-co.2', code: 'G-CO.2', description: 'Represent transformations in the plane using, e.g., transparencies and geometry software.' },
          { id: 'g-co.3', code: 'G-CO.3', description: 'Given a rectangle, parallelogram, trapezoid, or regular polygon, describe the rotations and reflections that carry it onto itself.' }
        ]
      },
      {
        id: 'geo-g-srt',
        title: 'G-SRT: Similarity, Right Triangles, & Trigonometry',
        standards: [
          { id: 'g-srt.1', code: 'G-SRT.1', description: 'Verify experimentally the properties of dilations given by a center and a scale factor.' },
          { id: 'g-srt.2', code: 'G-SRT.2', description: 'Given two figures, use the definition of similarity in terms of similarity transformations to decide if they are similar.' },
          { id: 'g-srt.3', code: 'G-SRT.3', description: 'Use the properties of similarity transformations to establish the AA criterion for two triangles to be similar.' }
        ]
      }
    ]
  }
}

export default function StandardsExplorer() {
  const { data: session } = useSession()
  const { setBreadcrumbs } = useNav()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [viewMode, setViewMode] = useState('hierarchy') // 'hierarchy' or 'graph'
  const [searchTerm, setSearchTerm] = useState('')
  
  // Set breadcrumbs when component mounts
  useEffect(() => {
    setBreadcrumbs([
      { href: '/', label: 'Home' },
      { href: '/standards', label: 'Standards Explorer' }
    ])
    
    if (selectedCourse) {
      setBreadcrumbs(prev => [
        ...prev.slice(0, 2),
        { href: `/standards?course=${selectedCourse}`, label: STANDARDS_DATA[selectedCourse].title }
      ])
      
      if (selectedDomain) {
        const domain = STANDARDS_DATA[selectedCourse].domains.find(d => d.id === selectedDomain)
        if (domain) {
          setBreadcrumbs(prev => [
            ...prev.slice(0, 3),
            { 
              href: `/standards?course=${selectedCourse}&domain=${selectedDomain}`, 
              label: domain.title
            }
          ])
        }
      }
    }
  }, [selectedCourse, selectedDomain, setBreadcrumbs])
  
  // Filter standards based on search
  const filteredCourses = Object.values(STANDARDS_DATA).filter(course => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    if (course.title.toLowerCase().includes(searchLower) || 
        course.description.toLowerCase().includes(searchLower)) {
      return true
    }
    
    // Search in domains and standards
    return course.domains.some(domain => {
      if (domain.title.toLowerCase().includes(searchLower)) return true
      
      return domain.standards.some(standard => 
        standard.code.toLowerCase().includes(searchLower) ||
        standard.description.toLowerCase().includes(searchLower)
      )
    })
  })
  
  return (
    <div className="min-h-screen pt-16">
      <Breadcrumbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Standards Explorer</h1>
            <p className="mt-2 text-sm text-gray-500">
              Explore NYSED curriculum standards for Algebra I, Algebra II, and Geometry
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search standards..."
                className="w-full md:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute right-3 top-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`px-3 py-2 text-sm ${viewMode === 'hierarchy' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('hierarchy')}
              >
                Hierarchy
              </button>
              <button
                className={`px-3 py-2 text-sm ${viewMode === 'graph' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('graph')}
              >
                Graph
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === 'hierarchy' ? (
          <div className="grid grid-cols-1 gap-8">
            {selectedCourse && selectedDomain ? (
              <DomainView 
                course={STANDARDS_DATA[selectedCourse]} 
                domain={STANDARDS_DATA[selectedCourse].domains.find(d => d.id === selectedDomain)}
                onBack={() => setSelectedDomain(null)}
              />
            ) : selectedCourse ? (
              <CourseView 
                course={STANDARDS_DATA[selectedCourse]} 
                onSelectDomain={setSelectedDomain}
                onBack={() => setSelectedCourse(null)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div 
                    key={course.id}
                    className="glassmorphism rounded-lg p-6 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-primary/10 px-3 py-1 rounded-full">
                        {course.domains.length} domains
                      </span>
                      <span className="text-primary text-sm">Explore →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="glassmorphism rounded-lg p-6 h-[600px] flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Interactive Graph View</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                The graph view would display a visual representation of the curriculum standards and their relationships, showing prerequisite connections.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CourseView({ course, onSelectDomain, onBack }) {
  return (
    <div>
      <button 
        onClick={onBack}
        className="inline-flex items-center text-primary hover:underline mb-4"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to courses
      </button>
      
      <div className="glassmorphism rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Domains</h3>
      <div className="grid grid-cols-1 gap-4">
        {course.domains.map(domain => (
          <div 
            key={domain.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
            onClick={() => onSelectDomain(domain.id)}
          >
            <h4 className="font-medium">{domain.title}</h4>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                {domain.standards.length} standards
              </span>
              <span className="text-primary text-sm">View details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DomainView({ course, domain, onBack }) {
  return (
    <div>
      <button 
        onClick={onBack}
        className="inline-flex items-center text-primary hover:underline mb-4"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {course.title}
      </button>
      
      <div className="glassmorphism rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{domain.title}</h2>
        <div className="text-sm font-medium text-primary/80 mb-2">{course.title}</div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Standards</h3>
      <div className="grid grid-cols-1 gap-4">
        {domain.standards.map(standard => (
          <div 
            key={standard.id}
            className="glassmorphism rounded-lg p-4"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 text-primary font-mono text-sm px-2 py-1 rounded mr-3 mt-1">
                {standard.code}
              </div>
              <div>
                <p className="text-gray-800">{standard.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}