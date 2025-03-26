'use client'

import Link from 'next/link'
import { useNav } from './NavContext'

export function Breadcrumbs() {
  const { breadcrumbs } = useNav()
  
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }
  
  return (
    <nav aria-label="Breadcrumb" className="py-1 px-4 sm:px-6 lg:px-8">
      <ol className="flex items-center flex-wrap space-x-1 text-xs text-medium-contrast">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg className="h-4 w-4 flex-shrink-0 text-text-light mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              
              {isLast ? (
                <span className="font-medium text-primary px-2 py-1 bg-primary/10 rounded-full text-xs">{crumb.label}</span>
              ) : (
                <Link 
                  href={crumb.href} 
                  className="hover:text-primary transition-colors px-2 py-0.5 rounded-full hover:bg-primary/5"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}