"use client";
import Link from "next/link";
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
import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
// Supabase client
import { supabase } from "@/utils/supabase/client";
import URLS from "@/url/web_url";


const WaterQualityForm = () => {
  // Toast hook
  const { toast } = useToast();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [shareLocation, setShareLocation] = useState(true);

  // Define state for each input field
  const [ph, setPh] = useState<number | "">("");
  const [hardness, setHardness] = useState<number | "">("");
  const [solids, setSolids] = useState<number | "">("");
  const [chloramines, setChloramines] = useState<number | "">("");
  const [sulfate, setSulfate] = useState<number | "">("");
  const [conductivity, setConductivity] = useState<number | "">("");
  const [organicCarbon, setOrganicCarbon] = useState<number | "">("");
  const [trihalomethanes, setTrihalomethanes] = useState<number | "">("");
  const [turbidity, setTurbidity] = useState<number | "">("");
  const [prediction, setPrediction] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [severity, setSeverity] = useState<string | null>(null);

  // Get user's geolocation when component mounts
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

  // Handle input changes (validation can be added here as well)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setter(e.target.value ? parseFloat(e.target.value) : "");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit behavior
    setLoading(true); // Show loading indicator

    // Collect data to send in the POST request
    const formData: any = {
      ph,
      hardness,
      solids,
      chloramines,
      sulfate,
      conductivity,
      organic_carbon: organicCarbon,
      trihalomethanes,
      turbidity,
      // latitude dan longitude jangan langsung dimasukkan
    };

    if (shareLocation) {
      formData.latitude = latitude;
      formData.longitude = longitude;
    }

    try {

      const response = await axios.post(
        `${URLS.API}/predict`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { potability_prediction, severity, probability } = response.data;
      const label = potability_prediction === 1 ? "Layak Minum" : "Tidak Layak";

      // Show toast with result
      toast({
        title: "Prediksi Kualitas Air",
        description: `${label} — Tingkat Keparahan: ${severity}`,
      });

      // Save to Supabase
      const { error } = await supabase
        .from("water_quality_predictions") // new table
        .insert([
          {
            report_id: null, // or the actual user report’s UUID
            ph,
            hardness,
            solids,
            chloramines,
            sulfate,
            conductivity,
            organic_carbon: organicCarbon,
            trihalomethanes,
            turbidity,
            probability,
            prediction: potability_prediction,
            severity,
            latitude,
            longitude,
          },
        ]);

      if (error) console.error("Supabase insert error:", error);
      
    } catch (error) {
      console.error("Error while predicting:", error);
      toast({
        title: "Kesalahan Prediksi",
        description: "Tidak dapat memprediksi kelayakan air.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <main className="flex-1 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold tracking-tight">
                Prediksi Kualitas Air
              </h1>
              <Link href="/">
                <Button variant="outline">Kembali ke Dashboard</Button>
              </Link>
            </div>
            <Card className="max-w-2xl mx-auto p-6 ">
              <CardHeader className="space-y-2 text-lg">
                <CardTitle>Data Sampel</CardTitle>
                <CardDescription>
                  Masukkan data dari sampel air
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                  <Label htmlFor="location">Nama Lokasi</Label>
                  <Input id="location" placeholder="Masukkan nama badan air atau area" />
                </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareLocation}
                      onChange={() => setShareLocation((prev) => !prev)}
                    />
                    Bagikan lokasi saya
                  </label>
                  <div className="space-y-6">
                    {/* pH level */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ph">Tingkat pH (0-14)</Label>
                        <Input
                          id="ph"
                          type="number"
                          min="0"
                          max="14"
                          placeholder="Masukkan tingkat pH"
                          value={ph}
                          onChange={(e) => handleChange(e, setPh)}
                        />
                      </div>

                      {/* Hardness */}
                      <div className="space-y-2">
                        <Label htmlFor="Hardness">Kesadahan (0-1000 mg/L)</Label>
                        <Input
                          id="Hardness"
                          type="number"
                          min="0"
                          max="1000"
                          placeholder="Masukkan dalam mg/L"
                          value={hardness}
                          onChange={(e) => handleChange(e, setHardness)}
                        />
                      </div>
                    </div>

                    {/* Total Dissolved Solids and Chloramines */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="Solids">
                          Total Zat Terlarut (0-100.000 mg/L)
                        </Label>
                        <Input
                          id="Solids"
                          type="number"
                          min="0"
                          max="100000"
                          placeholder="Masukkan dalam mg/L"
                          value={solids}
                          onChange={(e) => handleChange(e, setSolids)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="Chloramines">
                          Kloramin (0-10 mg/L)
                        </Label>
                        <Input
                          id="Chloramines"
                          type="number"
                          min="0"
                          max="10"
                          placeholder="Masukkan dalam mg/L"
                          value={chloramines}
                          onChange={(e) => handleChange(e, setChloramines)}
                        />
                      </div>
                    </div>

                    {/* Sulfate and Conductivity */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="Sulfate">Sulfat (0-1000 mg/L)</Label>
                        <Input
                          id="Sulfate"
                          type="number"
                          min="0"
                          max="1000"
                          placeholder="Masukkan dalam mg/L"
                          value={sulfate}
                          onChange={(e) => handleChange(e, setSulfate)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="Conductivity">
                          Konduktivitas (0-100.000 µS/cm)
                        </Label>
                        <Input
                          id="Conductivity"
                          type="number"
                          min="0"
                          max="100000"
                          placeholder="Masukkan dalam µS/cm"
                          value={conductivity}
                          onChange={(e) => handleChange(e, setConductivity)}
                        />
                      </div>
                    </div>

                    {/* Organic Carbon and Trihalomethanes */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="Organic_carbon">
                          Karbon Organik (0-100 mg/L)
                        </Label>
                        <Input
                          id="Organic_carbon"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Masukkan dalam mg/L"
                          value={organicCarbon}
                          onChange={(e) => handleChange(e, setOrganicCarbon)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="Trihalomethanes">
                          Trihalometana (0-300 µg/L)
                        </Label>
                        <Input
                          id="Trihalomethanes"
                          type="number"
                          min="0"
                          max="300"
                          placeholder="Masukkan dalam µg/L"
                          value={trihalomethanes}
                          onChange={(e) => handleChange(e, setTrihalomethanes)}
                        />
                      </div>
                    </div>

                    {/* Turbidity */}
                    <div className="space-y-2">
                      <Label htmlFor="Turbidity">Kekeruhan (0-1000 NTU)</Label>
                      <Input
                        id="Turbidity"
                        type="number"
                        min="0"
                        max="1000"
                        placeholder="Masukkan dalam NTU"
                        value={turbidity}
                        onChange={(e) => handleChange(e, setTurbidity)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Memproses..." : "Prediksi"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => window.location.reload()}
                    >
                      Bersihkan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      {/* Toast container at root of this component */}
      <ToastViewport />
    </ToastProvider>
  );
};

export default WaterQualityForm;
