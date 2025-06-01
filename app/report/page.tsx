"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBoundsExpression } from "leaflet";

const schema = z.object({
  location: z.string().min(1, {
    message: "Tidak boleh kosong",
  }),
  title: z.string().min(1, {
    message: "Tidak boleh kosong",
  }),
  severity: z.string(),
  pollution_type: z.string(),
  description: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  user_name: z.string().optional().nullable(),
});

type ReportData = z.infer<typeof schema>;

const indonesiaBounds: LatLngBoundsExpression = [
  [-11.0, 95.0], // Southwest (bawah kiri)
  [6.0, 141.0], // Northeast (atas kanan)
];
interface UserLocation {
  onLocationFound: (pos: [number, number]) => void;
}

function UserLocationMarker({ onLocationFound }: UserLocation) {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(coords);
        map.setView(coords, 20);
        onLocationFound(coords);
      },
      (err) => {
        console.error("Lokasi tidak bisa diambil:", err);
      }
    );
  }, [map]);

  return position ? (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconAnchor: [12, 41],
      })}
    />
  ) : null;
}

export default function FormPage() {

  const defaultValues = {
    location: "",
    title: "",
    severity: "",
    pollution_type: "",
    description: null,
    contact: null,
    user_name: null,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<ReportData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);

  const onSubmit = async (value: ReportData) => {
    try{
      if (!watch("pollution_type")) {
      setError("pollution_type", {
        type: "manual",
        message: "Tidak boleh kosong",
      });
    }

    if (!watch("severity")) {
      setError("severity", {
        type: "manual",
        message: "Tidak boleh kosong",
      });
    }

    if (!watch("severity") || !watch("pollution_type")) return;

    setLoading(true);

    let reportData = {};

    if (userLocation) {
      reportData = {
        latitude: userLocation[0],
        longitude: userLocation[1],
      };
    }

    reportData = {
      ...reportData,
      ...value,
    } as ReportData;


    const { data, error } = await supabase
      .from("pollution_reports")
      .upsert(reportData)
      .select();

    if (error) {
      toast({
        title: "Gagal mengirim laporan",
        description: error.message,
        variant: "destructive",
      });
      
      throw error;
    }

    if (data) {
      const report_id = data[0].id;

      if (images && images.length > 0) {
        images.forEach(async (val) => {
          const safeFileName = `report-images/${val.name}`;

          const { data: bucket_data, error } = await supabase.storage
            .from("jernih")
            .upload(safeFileName, val, {
              cacheControl: "3600",
              upsert: false,
              contentType: val.type,
            });

          if (bucket_data) {
            const path = bucket_data.path;

            const { data: asset_data, error: asset_error } = await supabase
              .from("assets")
              .insert({
                model_id: report_id,
                model_type: "pollution_reports",
                path,
              });

            if (asset_error) {
              toast({
                title: "Terjadi Kesalahan",
                description: asset_error.message,
                variant: "destructive",
              });
              throw error;
            }
          }
        });
      }

      toast({
        title: "Laporan Terkirim",
        description: "Terima kasih atas kontribusi Anda.",
        variant: "success",
      });
    }
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false);
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    const updatedImages = images.filter((_, idx) => idx !== indexToDelete);
    setImages(updatedImages);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImages((prev) => [...prev, file]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    reset(defaultValues);
    setImages([]);
  }

  return (
    <div className="flex min-h-screen flex-col">
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
              <CardTitle className="text-xl">Laporan Pencemaran</CardTitle>
              <CardDescription>
                Bantu lindungi air kita. Laporkan pencemaran di wilayah Anda
                untuk meningkatkan kesadaran dan mendorong aksi nyata.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Judul
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Contoh: Tumpahan Minyak di Sungai Ciliwung"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Nama Lokasi
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="Contoh: Sungai Ciliwung, Jakarta"
                    {...register("location")}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pollutionType">
                      Jenis Pencemaran <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("pollution_type", value, {
                          shouldValidate: true,
                        })
                      }
                      value={watch("pollution_type")}
                    >
                      <SelectTrigger id="pollutionType">
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="chemical">
                          Pembuangan Bahan Kimia
                        </SelectItem>
                        <SelectItem value="oil">Tumpahan Minyak</SelectItem>
                        <SelectItem value="plastic">Limbah Plastik</SelectItem>
                        <SelectItem value="sewage">Limbah Cair</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>

                    {errors.pollution_type && (
                      <p className="text-red-500 text-sm">
                        {errors.pollution_type.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">
                      Tingkat Keparahan <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("severity", value, {
                          shouldValidate: true,
                        })
                      }
                      value={watch("severity")}
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

                    {errors.severity && (
                      <p className="text-red-500 text-sm">
                        {errors.severity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Titik Lokasi</Label>

                  <div className="h-[500px]">
                    <MapContainer
                      zoom={5}
                      scrollWheelZoom={true}
                      className="w-full h-full z-0"
                      maxBounds={indonesiaBounds}
                      maxBoundsViscosity={1.0}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      <UserLocationMarker onLocationFound={setUserLocation} />
                    </MapContainer>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Foto Pencemaran</Label>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadImage}
                    accept="image/*"
                  />

                  <ul className="space-y-1">
                    {images.map((img, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between text-sm border px-3 py-2 rounded-md"
                      >
                        <span className="truncate max-w-[200px]">
                          {img.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Hapus
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Contoh: Terlihat limbah plastik menyumbat aliran sungai dekat jembatan.."
                    rows={4}
                    {...register("description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_name">Nama</Label>
                  <Input
                    id="user_name"
                    placeholder="Masukkan nama (opsional)"
                    {...register("user_name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Informasi Kontak</Label>
                  <Input
                    id="contact"
                    placeholder="Masukkan email (opsional)"
                    {...register("contact")}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={resetForm} disabled={loading}>
                    Bersihkan
                  </Button>
                  <Button type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Laporan'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
