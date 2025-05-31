"use client";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardChart } from "@/components/dashboard-chart";
import { PollutionMap } from "@/components/pollution-map";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Kualitas Air
            </h1>
            <Link href="/form">
              <Button>Laporkan Pencemaran</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Monitoring Kualitas Air</CardTitle>
                <CardDescription>
                  Pantau indikator kualitas air selama 6 bulan terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <DashboardChart />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-full md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Area Air Tercemar</CardTitle>
                <CardDescription>
                  Peta interaktif insiden pencemaran yang dilaporkan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <PollutionMap />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lokasi Air Bersih</CardTitle>
                <CardDescription>
                  Lokasi yang dipantau bulan ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">2.853</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-emerald-500">↑ 12%</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Indeks Kualitas Air</CardTitle>
                <CardDescription>Skor rata-rata kualitas (0-100)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">24,5%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-emerald-500">↑ 3,2%</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Polutan yang Dihilangkan</CardTitle>
                <CardDescription>Kilogram polutan yang dibersihkan bulan ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">48.294 kg</div>
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="text-rose-500">↓ 4,3%</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Melihat pencemaran di daerah Anda?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Laporkan insiden pencemaran air di lingkungan Anda untuk membantu menjaga kebersihan air bersama.
            </p>
            <Link href="/report-form">
              <Button size="lg" className="px-8">
                Laporkan Pencemaran
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
