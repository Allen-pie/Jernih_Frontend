"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, XCircle, Clock, Shield, RefreshCw, Home, LogIn, Mail } from "lucide-react"

type ErrorType = "unknown"

interface ErrorConfig {
  title: string
  description: string
  icon: React.ReactNode
  actions: Array<{
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline" | "destructive"
    icon?: React.ReactNode
  }>
  alertMessage?: string
  alertVariant?: "default" | "destructive"
}

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const errorType = (searchParams.get("error") as ErrorType) || "unknown"
  const email = searchParams.get("email")
  const returnUrl = searchParams.get("return_url") || "/"

  const handleRetry = () => {
    setIsRedirecting(true)
    router.push("/login")
  }

  const errorConfigs: Record<ErrorType, ErrorConfig> = {
    unknown: {
      title: "Terjadi Kesalahan",
      description:
        "Terjadi kesalahan tak terduga saat proses autentikasi.",
      icon: <AlertTriangle className="h-12 w-12 text-gray-500" />,
      actions: [
        { label: "Coba Lagi", onClick: handleRetry, icon: <RefreshCw className="mr-2 h-4 w-4" /> },
        { label: "Kembali ke Dashboard", href: "/dashboard", variant: "outline" as const, icon: <Home className="mr-2 h-4 w-4" /> },
      ],
      alertMessage: "Error details have been logged for our technical team to review.",
      alertVariant: "destructive",
    },
  }

  const config = errorConfigs[errorType]


  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">{config.icon}</div>
          <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
          <CardDescription className="text-base">{config.description}</CardDescription>
          {email && (
            <p className="text-sm text-muted-foreground">
              Account: <span className="font-medium">{email}</span>
            </p>
          )}
        </CardHeader>

    
        <CardFooter className="flex flex-col space-y-3">
          {config.actions.map((action, index) => {
            if (action.href) {
              return (
                <Link key={index} href={action.href} className="w-full">
                  <Button variant={action.variant || "default"} className="w-full">
                    {action.icon}
                    {action.label}
                  </Button>
                </Link>
              )
            }

            return (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={isRedirecting }
                className="w-full"
              >
                {action.icon}
                {action.label}
              </Button>
            )
          })}

        </CardFooter>
      </Card>
    </div>
  )
}
