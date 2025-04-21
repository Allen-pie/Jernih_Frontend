"use client";
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { DashboardChart } from "@/components/dashboard-chart"
import { PollutionMap } from "@/components/pollution-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Water Quality Dashboard</h1>
            <Link href="/form">
              <Button>Report Pollution</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Water Quality Monitoring</CardTitle>
                <CardDescription>Track water quality indicators over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <DashboardChart />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-full md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Polluted Water Areas</CardTitle>
                <CardDescription>Interactive map of reported pollution incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <PollutionMap />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clean Water Sites</CardTitle>
                <CardDescription>Monitored locations this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">2,853</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-emerald-500">↑ 12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Water Quality Index</CardTitle>
                <CardDescription>Average quality score (0-100)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">24.5%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-emerald-500">↑ 3.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pollutants Removed</CardTitle>
                <CardDescription>Kilograms removed this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$48,294</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-rose-500">↓ 4.3%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">See pollution in your area?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Report water pollution incidents in your community to help us keep our waters clean.
            </p>
            <Link href="/report-form">
              <Button size="lg" className="px-8">
                Report Pollution
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}


