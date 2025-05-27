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
  const [severity, setSeverity] = useState(5);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validasi semua field wajib (kecuali contact)
  if (
    location.trim() === "" ||
    pollutionType.trim() === "" ||
    description.trim() === "" ||
    severity < 1 || severity > 10
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
      title: "Report Submitted",
      description: "Thank you for your contribution.",
    });

    // Reset form
    setLocation("");
    setPollutionType("");
    setSeverity(5);
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
              Report Water Pollution
            </h1>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Pollution Report</CardTitle>
              <CardDescription>
                  Help protect our water. Report pollution in your 
                  area to raise awareness and drive action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name*</Label>
                  <Input
                    id="location"
                    placeholder="Enter the name of the water body or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pollutionType">Pollution Type</Label>
                    <Select
                      onValueChange={setPollutionType}
                      value={pollutionType}
                    >
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
                    <Input
                      id="severity"
                      type="number"
                      min="1"
                      max="10"
                      value={severity}
                      onChange={(e) => setSeverity(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe what you observed, including color, smell, and any affected wildlife"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information (optional)</Label>
                  <Input
                    id="contact"
                    placeholder="Email or phone number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
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
  );
}
