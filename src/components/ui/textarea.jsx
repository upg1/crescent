"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm",
        "placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}