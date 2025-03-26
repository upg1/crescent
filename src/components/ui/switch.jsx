"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function Switch({
  className,
  checked,
  onCheckedChange,
  ...props
}) {
  return (
    <button
      role="switch"
      aria-checked={checked || false}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        checked ? "bg-blue-600" : "bg-gray-200",
        className
      )}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
}