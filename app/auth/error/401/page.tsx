"use client"
import type React from "react"
import {useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home} from "lucide-react"

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
  const searchParams = useSearchParams()
  const errorType = (searchParams.get("error") as ErrorType) || "unknown"
  const email = searchParams.get("email")

  const errorConfigs: Record<ErrorType, ErrorConfig> = {
    unknown: {
      title: "Akses Ditolak",
    description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
    icon: <AlertTriangle className="h-12 w-12 text-gray-500" />,
    actions: [
      {
        label: "Kembali ke Beranda",
        href: "/",
        variant: "outline" as const,
        icon: <Home className="mr-2 h-4 w-4" />,
      },
    ], 
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
