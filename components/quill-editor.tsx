"use client";

import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function QuillEditor({
  value,
  onChange,
  placeholder = "Write your article...",
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined" && editorRef.current && !quillRef.current) {
      import("quill").then(({ default: QuillClass }) => {
        if (!isMounted || !editorRef.current) return;

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
        });

        quillRef.current.on("text-change", () => {
          const content = quillRef.current.root.innerHTML;
          onChange(content);
        });

        // Set initial value
        if (value && quillRef.current) {
          quillRef.current.root.innerHTML = value;
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML &&
      document.activeElement !== quillRef.current.root // avoid override while typing
    ) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="bg-white border rounded-md">
      <div ref={editorRef} style={{ minHeight: "300px" }} />
    </div>
  );
}