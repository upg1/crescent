"use client"

import React, { useState, useEffect, useRef, createContext, useContext } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// Create dialog context
const DialogContext = createContext({
  open: false,
  setOpen: () => {},
})

export function Dialog({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false)
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])
  
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen)
    }
  }, [isOpen, onOpenChange])

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, ...props }) {
  const { setOpen } = useContext(DialogContext)
  
  return (
    <div
      {...props}
      onClick={(e) => {
        setOpen(true)
        props.onClick?.(e)
      }}
    >
      {children}
    </div>
  )
}

export function DialogContent({ children, className, ...props }) {
  const { open, setOpen } = useContext(DialogContext)
  const ref = useRef(null)
  
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    
    if (open) {
      window.addEventListener("keydown", handleKeyDown)
      // Prevent scrolling when dialog is open
      document.body.style.overflow = "hidden"
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, setOpen])
  
  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    
    if (open) {
      // Use setTimeout to prevent immediate closing when clicking trigger
      setTimeout(() => {
        document.addEventListener("mousedown", handleOutsideClick)
      }, 0)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [open, setOpen])
  
  if (!open) return null
  
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={ref}
          className={cn(
            "w-full max-w-md rounded-lg bg-white p-6 shadow-lg animate-in fade-in-0 zoom-in-95",
            className
          )}
          {...props}
        >
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </div>
    </>
  )
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("mb-4 space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  )
}

export function DialogTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}