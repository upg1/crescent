"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function Avatar({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

export function AvatarImage({
  className,
  ...props
}) {
  return (
    <img
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
}

export function AvatarFallback({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-800",
        className
      )}
      {...props}
    />
  )
}