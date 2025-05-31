"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { supabase } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";

type MonthData = {
  month: string;
  low: number;
  medium: number;
  high: number;
  total: number;
};

function normalizeSeverity(raw: string): "low" | "medium" | "high" | null {
  const s = raw?.trim().toLowerCase();
  if (s === "low") return "low";
  if (s === "medium") return "medium";
  if (s === "high") return "high";
  return null;
}

function groupByMonthAndSeverity(reports: { id: string; severity: string; created_at: string }[]): MonthData[] {
  const result: Record<string, MonthData> = {};
  reports.forEach((r) => {
    if (!r.created_at) return;
    const date = new Date(r.created_at);
    if (isNaN(date.getTime())) return;
    const monthKey = date.toLocaleString("default", { month: "short", year: "2-digit" });
    if (!result[monthKey]) {
      result[monthKey] = { month: monthKey, low: 0, medium: 0, high: 0, total: 0 };
    }
    const sev = normalizeSeverity(r.severity);
    if (sev) {
      result[monthKey][sev] += 1;
      result[monthKey].total += 1;
    }
  });
  // Sort and keep only the last 6 months
  return Object.values(result)
    .sort((a, b) => new Date("1 " + a.month).getTime() - new Date("1 " + b.month).getTime())
    .slice(-6);
}

export function DashboardChart() {
  const [data, setData] = useState<MonthData[]>([]);

  useEffect(() => {
    async function fetchReports() {
      const { data: reports, error } = await supabase
        .from("pollution_reports")
        .select("id, severity, created_at");
      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }
      if (reports) {
        const grouped = groupByMonthAndSeverity(reports);
        setData(grouped);
      }
    }
    fetchReports();
  }, []);

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-3 border shadow-sm">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-primary">
                      Rendah: {payload.find((p) => p.dataKey === "low")?.value || 0}
                    </p>
                    <p className="text-sm text-primary">
                      Sedang: {payload.find((p) => p.dataKey === "medium")?.value || 0}
                    </p>
                    <p className="text-sm text-primary">
                      Tinggi: {payload.find((p) => p.dataKey === "high")?.value || 0}
                    </p>
                    <p className="text-sm text-secondary">
                      Total: {payload.find((p) => p.dataKey === "total")?.value || 0}
                    </p>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="low" name="Rendah" fill="#60a5fa" radius={[4, 4, 0, 0]} hide={data.every((d) => !d.low)} />
          <Bar dataKey="medium" name="Sedang" fill="#fbbf24" radius={[4, 4, 0, 0]} hide={data.every((d) => !d.medium)} />
          <Bar dataKey="high" name="Tinggi" fill="#f87171" radius={[4, 4, 0, 0]} hide={data.every((d) => !d.high)} />
          <Line type="monotone" dataKey="total" name="Total Laporan (KDE)" stroke="#0e7490" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
