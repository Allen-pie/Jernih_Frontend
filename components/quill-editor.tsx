"use client"

import { useEffect, useRef } from "react"
import "quill/dist/quill.snow.css"

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function QuillEditor({ value, onChange, placeholder = "Write your article..." }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current && !quillRef.current) {
      import("quill").then((Quill) => {
        const QuillClass = Quill.default

        quillRef.current = new QuillClass(editorRef.current, {
          theme: "snow",
          placeholder,
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["blockquote", "code-block"],
              ["link", "image"],
              ["clean"],
            ],
          },
        })

        quillRef.current.on("text-change", () => {
          const content = quillRef.current.root.innerHTML
          onChange(content)
        })

        // Set initial value
        if (value) {
          quillRef.current.root.innerHTML = value
        }
      })
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return (
    <div className="bg-white border rounded-md">
      <div ref={editorRef} style={{ minHeight: "300px" }} />
    </div>
  )
}