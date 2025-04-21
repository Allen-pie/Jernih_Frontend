import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FormPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Report Water Pollution</h1>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Pollution Report</CardTitle>
              <CardDescription>
                Help us keep our waters clean by reporting pollution incidents in your area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Input id="location" placeholder="Enter the name of the water body or area" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pollutionType">Pollution Type</Label>
                    <Select>
                      <SelectTrigger id="pollutionType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chemical">Chemical Discharge</SelectItem>
                        <SelectItem value="oil">Oil Spill</SelectItem>
                        <SelectItem value="plastic">Plastic Waste</SelectItem>
                        <SelectItem value="sewage">Sewage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity (1-10)</Label>
                    <Input id="severity" type="number" min="1" max="10" placeholder="5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe what you observed, including color, smell, and any affected wildlife"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information (optional)</Label>
                  <Input id="contact" placeholder="Email or phone number" />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Submit Report</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

