"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sheet({ children, open, onOpenChange }) {
  return <>{children}</>
}

export function SheetTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>
}

export function SheetContent({ 
  children, 
  side = "right", 
  className, 
  open, 
  onOpenChange,
  ...props 
}) {
  useEffect(() => {
    // Prevent body scrolling when sheet is open
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  const sideClasses = {
    right: "right-0 h-full w-3/4 max-w-sm",
    left: "left-0 h-full w-3/4 max-w-sm", 
    top: "top-0 inset-x-0 h-auto",
    bottom: "bottom-0 inset-x-0 h-auto"
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          "fixed z-50 bg-white p-6 shadow-lg border transition-all duration-300",
          sideClasses[side],
          className
        )}
        {...props}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </>
  )
}

export function SheetHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
}

export function SheetTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />
}

export function SheetDescription({ className, ...props }) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />
}