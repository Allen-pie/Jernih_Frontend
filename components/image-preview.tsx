"use client"

import { useEffect, useState } from "react"
import { X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ImagePreviewProps {
  file_url?: string;
  file?: File
  onRemove: () => void
}

export function ImagePreview({ file, onRemove, file_url }: ImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isHovered, setIsHovered] = useState(false)

   useEffect(() => {
     if (file_url){
        setImageUrl(file_url)
    } else if (file){
        const url = URL.createObjectURL(file)
        setImageUrl(url)
    }
   },[file_url, file])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div
      className="relative group rounded-lg border border-border overflow-hidden bg-muted"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Preview */}
      <div className="aspect-video relative">
        <img src={imageUrl || "/placeholder.svg"} alt="Featured image preview" className="w-full h-full object-cover" />

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2 transition-opacity">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Featured Image Preview</DialogTitle>
                  <DialogDescription>Preview of your featured image</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Featured image full preview"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="destructive" size="sm" onClick={onRemove}>
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}

        {/* Delete button - always visible on mobile */}
        <Button variant="destructive" size="sm" className="absolute top-2 right-2 md:hidden" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Info */}
     {file &&(
         <div className="p-3 space-y-1">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <span>{file.type}</span>
        </div>
      </div>
     )}
    </div>
  )
}
