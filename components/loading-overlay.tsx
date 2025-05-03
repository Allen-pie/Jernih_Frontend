"use client"

import { Loader2 } from 'lucide-react'
import { useAuth } from './context/AuthContext'

interface LoadingOverlayProps {
  message?: string,
  isLoading?: boolean
}

export function LoadingOverlay({isLoading, message = "Loading..." }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}