import type React from "react"
import Link from "next/link"
import { LayoutDashboard, BarChart, FileText, Users, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("flex flex-col border-r h-full w-64", className)}>
      <div className="flex flex-col gap-2 p-4">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        <Link href="/analytics">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <BarChart className="h-5 w-5" />
            Water Quality
          </Button>
        </Link>
        <Link href="/report-form">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FileText className="h-5 w-5" />
            Report Pollution
          </Button>
        </Link>
        <Link href="/users">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users className="h-5 w-5" />
            Communities
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-5 w-5" />
            Conservation
          </Button>
        </Link>
      </div>
      <div className="mt-auto p-4 border-t">
        <Link href="/help">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <HelpCircle className="h-5 w-5" />
            Education & Resources
          </Button>
        </Link>
      </div>
    </div>
  )
}
