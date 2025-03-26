'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '8px',
        },
      }}
    />
  )
}
