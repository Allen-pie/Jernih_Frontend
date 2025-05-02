"use client"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react'
import axios from 'axios';
import { Badge } from "@/components/ui/badge"

const WaterQualityForm = () => {
    // Define state for each input field
    const [ph, setPh] = useState<number | ''>('');
    const [hardness, setHardness] = useState<number | ''>('');
    const [solids, setSolids] = useState<number | ''>('');
    const [chloramines, setChloramines] = useState<number | ''>('');
    const [sulfate, setSulfate] = useState<number | ''>('');
    const [conductivity, setConductivity] = useState<number | ''>('');
    const [organicCarbon, setOrganicCarbon] = useState<number | ''>('');
    const [trihalomethanes, setTrihalomethanes] = useState<number | ''>('');
    const [turbidity, setTurbidity] = useState<number | ''>('');
    const [prediction, setPrediction] = useState<string|null>('');
    const [loading, setLoading] = useState<boolean>(false);
  
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
        const formData = {
          ph,
          hardness,
          solids,
          chloramines,
          sulfate,
          conductivity,
          organic_carbon: organicCarbon,
          trihalomethanes,
          turbidity,
        };
    
        try {
          // Send POST request to Flask API
          const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          // Handle the response (e.g., display prediction)
          setPrediction(response.data.potability_prediction === 1 ? "Safe to Drink" : "Unsafe");
        } catch (error) {
          console.error("Error while predicting:", error);
          setPrediction("Error predicting water potability");
        } finally {
          setLoading(false); // Hide loading indicator
        }
      };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Water Quality Prediction</h1>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
          <Card className="max-w-2xl mx-auto p-6 ">
            <CardHeader className="space-y-2 text-lg" >
              <CardTitle>Sample Data</CardTitle>
              <CardDescription>
                Enter the data from the water sample 
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* <div className="space-y-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Input id="location" placeholder="Enter the name of the water body or area" />
                </div> */}
                <div className="space-y-6">
                    {/* pH level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="ph">pH level (0-14)</Label>
                        <Input id="ph" type="number" min="0" max="14" placeholder="Enter pH level" 
                        value={ph} onChange={(e) => handleChange(e, setPh)}/>
                        </div>

                        {/* Hardness */}
                        <div className="space-y-2">
                        <Label htmlFor="Hardness">Hardness (0-1000 mg/L)</Label>
                        <Input id="Hardness" type="number" min="0" max="1000" placeholder="Enter in mg/L" 
                        value={hardness} onChange={(e) => handleChange(e, setHardness)}/>
                        </div>
                    </div>

                    {/* Total Dissolved Solids and Chloramines */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="Solids">Total Dissolved Solids (0-100,000 mg/L)</Label>
                        <Input id="Solids" type="number" min="0" max="100000" placeholder="Enter in mg/L"
                        value={solids} onChange={(e) => handleChange(e, setSolids)} />
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="Chloramines">Chloramines (0-10 mg/L)</Label>
                        <Input id="Chloramines" type="number" min="0" max="10" placeholder="Enter in mg/L"
                        value={chloramines} onChange={(e) => handleChange(e, setChloramines)} />
                        </div>
                    </div>

                    {/* Sulfate and Conductivity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="Sulfate">Sulfate (0-1000 mg/L)</Label>
                        <Input id="Sulfate" type="number" min="0" max="1000" placeholder="Enter in mg/L" 
                        value={sulfate} onChange={(e) => handleChange(e, setSulfate)}/>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="Conductivity">Conductivity (0-100,000 µS/cm)</Label>
                        <Input id="Conductivity" type="number" min="0" max="100000" placeholder="Enter in µS/cm"
                        value={conductivity} onChange={(e) => handleChange(e, setConductivity)} />
                        </div>
                    </div>

                    {/* Organic Carbon and Trihalomethanes */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="Organic_carbon">Organic Carbon (0-100 mg/L)</Label>
                        <Input id="Organic_carbon" type="number" min="0" max="100" placeholder="Enter in mg/L" 
                        value={organicCarbon} onChange={(e) => handleChange(e, setOrganicCarbon)}/>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="Trihalomethanes">Trihalomethanes (0-300 µg/L)</Label>
                        <Input id="Trihalomethanes" type="number" min="0" max="300" placeholder="Enter in µg/L" 
                        value={trihalomethanes} onChange={(e) => handleChange(e, setTrihalomethanes)}/>
                        </div>
                    </div>

                    {/* Turbidity */}
                    <div className="space-y-2">
                        <Label htmlFor="Turbidity">Turbidity (0-1000 NTU)</Label>
                        <Input id="Turbidity" type="number" min="0" max="1000" placeholder="Enter in NTU" 
                        value={turbidity} onChange={(e) => handleChange(e, setTurbidity)}/>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Badge>{loading ? "Please wait..." : prediction}</Badge>
                  <Button variant="outline" type="button" onClick={() => window.location.reload()}>
                    Clear
                  </Button>
                  <Button type="submit">{loading ? "Predicting..." : "Predict"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default WaterQualityForm;

