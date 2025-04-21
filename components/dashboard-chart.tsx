"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  { month: "Jan", clarity: 65, pollutants: 42 },
  { month: "Feb", clarity: 72, pollutants: 38 },
  { month: "Mar", clarity: 68, pollutants: 45 },
  { month: "Apr", clarity: 75, pollutants: 32 },
  { month: "May", clarity: 82, pollutants: 28 },
  { month: "Jun", clarity: 78, pollutants: 30 },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-3 border shadow-sm">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-primary">Water Clarity: {payload[0].value}%</p>
                  <p className="text-sm text-secondary">Pollutants (ppm): {payload[1].value}</p>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="clarity" name="Water Clarity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pollutants" name="Pollutants" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

