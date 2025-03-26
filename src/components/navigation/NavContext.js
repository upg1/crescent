'use client'

import { createContext, useContext, useState } from 'react'

const NavContext = createContext({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
  currentUnit: null,
  setCurrentUnit: () => {},
  currentSection: null,
  setCurrentSection: () => {},
})

export function NavProvider({ children }) {
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [currentUnit, setCurrentUnit] = useState(null)
  const [currentSection, setCurrentSection] = useState(null)
  
  const value = {
    breadcrumbs,
    setBreadcrumbs,
    currentUnit,
    setCurrentUnit,
    currentSection,
    setCurrentSection
  }
  
  return (
    <NavContext.Provider value={value}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const context = useContext(NavContext)
  if (context === undefined) {
    throw new Error('useNav must be used within a NavProvider')
  }
  return context
}