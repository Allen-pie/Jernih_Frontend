"use client"
import { CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface Props {
  className?: string
}
export default function AnimatedCheckCircle({ className }: Props) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    // Reset and replay animation every 3 seconds
    const interval = setInterval(() => {
      setAnimate(false)
      setTimeout(() => setAnimate(true), 100)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
      <div className={cn("relative", className)}>
        <CircleCheck
          className={cn(
            "w-12 h-12 text-green-500 transition-all duration-700",
            animate && "animate-in fade-in zoom-in",
          )}
        //   strokeWidth={1}
        />

        {/* Pulse effect 1 */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-green-500 opacity-0",
            animate && "animate-ping opacity-30",
          )}
        ></div>

        {/* Pulse effect 2 - delayed */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border border-green-400 opacity-0 scale-110",
            animate && "animate-ping opacity-20 delay-200",
          )}
        ></div>

        {/* Pulse effect 3 - more delayed */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border border-green-300 opacity-0 scale-125",
            animate && "animate-ping opacity-10 delay-500",
          )}
        ></div>
      </div>
   
  )
}
