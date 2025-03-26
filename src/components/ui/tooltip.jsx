"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

export function Tooltip({ children, content, className }) {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute z-50 px-2 py-1 text-sm bg-gray-800 text-white rounded shadow-lg",
          "top-full mt-1",
          className
        )}>
          {content}
        </div>
      )}
    </div>
  )
}