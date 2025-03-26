"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function Label({
  className,
  htmlFor,
  ...props
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}