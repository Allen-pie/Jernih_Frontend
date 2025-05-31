"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from '@/utils/supabase/client'
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; 


export default function FormPage() {
  const { toast } = useToast();

  const [location, setLocation] = useState("");
  const [pollutionType, setPollutionType] = useState("");
  const [severity, setSeverity] = useState("Rendah");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validasi semua field wajib (kecuali contact)
  if (
    location.trim() === "" ||
    pollutionType.trim() === "" ||
    description.trim() === "" ||
    severity.trim() === ""
  ) {
    toast({
      title: "Missing Required Fields",
      description: "Please fill out all required fields correctly before submitting.",
      variant: "destructive",
    });
    return;
  }

  const { error } = await supabase.from("pollution_reports").insert([
    {
      location,
      pollutionType,
      severity,
      description,
      contact,
    },
  ]);

  if (error) {
    toast({
      title: "Submission Failed",
      description: error.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Laporan Terkirim",
      description: "Terima kasih atas kontribusi Anda.",
    });

    // Reset form
    setLocation("");
    setPollutionType("");
    setSeverity("Rendah");
    setDescription("");
    setContact("");
  }
};


  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-center">
              Laporkan Pencemaran Air
            </h1>
            <Link href="/">
              <Button variant="outline">Kembali ke Dashboard</Button>
            </Link>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Laporan Pencemaran</CardTitle>
              <CardDescription>
                Bantu lindungi air kita. Laporkan pencemaran di wilayah Anda untuk meningkatkan kesadaran dan mendorong aksi nyata.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Nama Lokasi
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="Masukkan nama badan air atau area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pollutionType">Jenis Pencemaran</Label>
                    <Select
                      onValueChange={setPollutionType}
                      value={pollutionType}
                    >
                      <SelectTrigger id="pollutionType">
                        <SelectValue placeholder="Pilih jenis" />
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
                    <Label htmlFor="severity">Tingkat Keparahan</Label>
                    <Select
                      id="severity"
                      value={severity}
                      onValueChange={setSeverity}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Pilih tingkat keparahan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan apa yang Anda amati, termasuk warna, bau, dan satwa yang terdampak (jika ada)"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Informasi Kontak (opsional)</Label>
                  <Input
                    id="contact"
                    placeholder="Email atau nomor telepon"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button">
                    Batal
                  </Button>
                  <Button type="submit">Kirim Laporan</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
