"use client";
import { useState, useMemo, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Eye,
  Plus,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getReportsForAdmin } from "@/utils/supabase/report";
import { Asset, Report } from "@/app/interfaces";
import { useDebounce } from "@/hooks/use-debounce";
import dayjs from "dayjs";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { StatusUpdateDialog } from "@/components/status-update-modal";
import { supabase } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { BUCKET_URLS } from "@/url/bucket_url";

const statusColors: Record<string, string> = {
  in_review: "bg-blue-100 text-blue-800 border-blue-200 max-w-fit h-5 mt-0.5 gap-1.5",
  verified: "bg-green-100 text-green-800 border-green-200 max-w-fit h-5 mt-0.5 gap-1.5",
  rejected: "bg-red-100 text-red-800 border-red-200 max-w-fit h-5 mt-0.5 gap-1.5",
};

const statusIcons: Record<string, React.ReactNode> = {
  in_review: <Clock className="w-4 h-4" />,
  verified: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

const severityColor = (severity: string) => {
  if (severity == "low") return "text-green-600";
  if (severity == "medium") return "text-yellow-600";
  return "text-red-600";
};

const severityLabels: Record<string, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

const statusLabels: Record<string, string> = {
  in_review: "Sedang Ditinjau",
  verified: "Terverifikasi",
  rejected: "Ditolak",
};

const pollutionTypeLabels: Record<string, string> = {
  chemical: "Pembuangan Bahan Kimia",
  oil: "Tumpahan Minyak",
  plastic: "Limbah Plastik",
  sewage: "Limbah Cair",
  other: "Lainnya",
};

interface StatusDialog {
  open: boolean;
  report: Report | null;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300); // delay 300ms

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedReportImgs, setSelectedReportImgs] = useState<Asset[]>([]);
  const [loadingImgs, setLoadingImgs] = useState<boolean>(false);

  const [statusDialog, setStatusDialog] = useState<StatusDialog>({
    open: false,
    report: null,
  });

  const openGoogleMaps = (latitude: string, longitude: string) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const deleteReport = async (report_id : number) => {
    const response = await supabase.from('pollution_reports').delete().eq('id', report_id);
    toast({
      title : "Laporan berhasil dihapus"
    })
    getReports();
  }

  const getReportImages = async (report_id: number) => {
    try {
      setSelectedReportImgs([]);
      setLoadingImgs(true);
      const { data, error } = await supabase
        .from("assets")
        .select()
        .eq("model_id", report_id)
        .eq("model_type", "pollution_reports");

      if (error) {
        throw error;
      }

      const images = data as Asset[];
      setSelectedReportImgs(data);
    } catch (error) {
      toast({
        title: "Gagal mengambil gambar laporan",
        variant: "destructive",
      });
    } finally {
      setLoadingImgs(false);
    }
  };

  useEffect(() => {}, []);

  const handleCloseStatusDialog = () => {
    setStatusDialog({
      open: false,
      report: null,
    });
  };

  const handleStatusUpdate = (
    id: number,
    new_status: string,
    reason: string
  ) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id == id ? { ...report, status: new_status } : report
      )
    );
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: reports.length,
      in_review: 0,
      verified: 0,
      rejected: 0,
    };

    reports.forEach((report) => {
      counts[report.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const getReports = async () => {
    const data = (await getReportsForAdmin()) as Report[];
    if (data) {
      setReports(data);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  const filteredAndSortedReports = useMemo(() => {
    const filtered = reports.filter((report: Report) => {
      const matchesSearch =
        (report.description ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (report.location ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;
      const matchesType =
        typeFilter === "all" || report.pollution_type === typeFilter;
      // const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        // case "severity-high":
        //   return b.severity - a.severity
        // case "severity-low":
        //   return a.severity - b.severity
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    debouncedSearch,
    statusFilter,
    typeFilter,
    priorityFilter,
    sortBy,
    reports,
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Laporan Pencemaran
              </h1>
              <p className="text-muted-foreground mt-1">
                Memantau dan mengelola seluruh laporan insiden pencemaran
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/report">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Laporan
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* <div className="space-y-2">

                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div> */}

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="in_review">Sedang Ditinjau</SelectItem>
                      <SelectItem value="verified">Terverifikasi</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipe Pencemaran</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="chemical">Bahan Kimia</SelectItem>
                      <SelectItem value="oil">Tumpahan Minyak</SelectItem>
                      <SelectItem value="plastic">Limbah Plastik</SelectItem>
                      <SelectItem value="sewage">Limbah Cair</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Urutkan Berdasarkan:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="severity-high">
                        Severity (High to Low)
                      </SelectItem>
                      <SelectItem value="severity-low">
                        Severity (Low to High)
                      </SelectItem>
                      <SelectItem value="location">Location (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Tabs */}
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="all">Semua ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="in_review">
                Sedang Ditinjau ({statusCounts["in_review"]})
              </TabsTrigger>
              <TabsTrigger value="verified">
                Terverifikasi ({statusCounts["verified"]})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Ditolak ({statusCounts["rejected"]})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredAndSortedReports.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Laporan tidak ditemukan
                    </h3>
                    <p className="text-muted-foreground">
                      Coba sesuaikan filter.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedReports.map((report: Report) => (
                <Card
                  key={report.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-lg font-semibold">
                            {report.title}
                          </h3>

                          <Badge className={`${statusColors[report.status]} ml-auto`} >
                            {statusIcons[report.status]}
                            {statusLabels[report.status]}
                          </Badge>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {report.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />

                            {dayjs(report.created_at).format("DD/MM/YYYY")}
                          </div>
                          <div className="flex items-center">
                            <AlertTriangle
                              className={`mr-1 h-4 w-4 ${severityColor(
                                report.severity
                              )}`}
                            />
                            Tingkat: {severityLabels[report.severity]}
                          </div>
                          <div>
                            Tipe: {pollutionTypeLabels[report.pollution_type]}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {report.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Dilaporkan Oleh:
                            </span>{" "}
                            <span className="font-medium">
                              {report.user_name ?? "-"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    getReportImages(report.id);
                                  }}
                                >
                                  <Eye className="mr-1 h-4 w-4" />
                                  Lihat Detail
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{report.title}</DialogTitle>
                                  <DialogDescription>
                                    Report ID: {report.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Lokasi
                                      </Label>
                                      <p className="text-sm">
                                        {report.location}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Koordinat
                                      </Label>
                                      <p className="text-sm">
                                        {report.latitude && report.longitude
                                          ? (
                                            <a onClick={() => openGoogleMaps(report.latitude ?? '0', report.longitude ?? '0')} className="underline text-blue-700 font-semibold flex flex-row items-center gap-1 w-fit cursor-pointer">
                                              Buka
                                              <ExternalLink className="w-4 h-4"/> 
                                            </a>
                                          )
                                          : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Tipe Pencemaran
                                      </Label>
                                      <p className="text-sm">
                                        {
                                          pollutionTypeLabels[
                                            report.pollution_type
                                          ]
                                        }
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Tingkat Pencemaran
                                      </Label>
                                      <p
                                        className={`text-sm font-medium ${severityColor(
                                          report.severity
                                        )}`}
                                      >
                                        {severityLabels[report.severity]}
                                      </p>
                                    </div>

                                    <div className="flex flex-col">
                                      <Label className="text-sm font-medium">
                                        Status
                                      </Label>
                                      <Badge
                                        className={statusColors[report.status]}
                                      >
                                        {statusIcons[report.status]}
                                        {statusLabels[report.status]}
                                      </Badge>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-medium">
                                        Dilaporkan Oleh
                                      </Label>
                                      <p className="text-sm">
                                        {report.user_name ?? "-"}
                                      </p>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-medium">
                                        Kontak
                                      </Label>
                                      <p className="text-sm">
                                        {report.contact ?? "-"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Deskripsi
                                    </Label>
                                    <p className="text-sm mt-1">
                                      {report.description ?? '-'}
                                    </p>
                                  </div>

                                  {/* fetch image */}

                                  {loadingImgs && (
                                    <div className="flex justify-center">
                                      <div className="animate-spin h-6 w-6 rounded-full border-t-2 border-blue-500 border-solid" />
                                    </div>
                                  )}

                                  {selectedReportImgs && selectedReportImgs.length > 0 && !loadingImgs && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Unggahan Foto
                                      </Label>
                                      {selectedReportImgs.map((item, idx) => (
                                        <div className="mb-4" key={idx}>
                                          <Image
                                            src={
                                              BUCKET_URLS.main + "/" + item.path
                                            }
                                            alt=""
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-auto"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {statusDialog.report?.status && (
                              <StatusUpdateDialog
                                isOpen={statusDialog.open}
                                onClose={handleCloseStatusDialog}
                                currentStatus={statusDialog.report!.status}
                                reportId={statusDialog.report!.id}
                                reportTitle={statusDialog.report!.title}
                                onStatusUpdate={(newStatus, reason) =>
                                  handleStatusUpdate(
                                    statusDialog.report?.id!,
                                    newStatus,
                                    reason!
                                  )
                                }
                              />
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                <DropdownMenuItem
                                  onClick={() => {
                                    // animasi dropdown sama dialog nabrak
                                    requestAnimationFrame(() => {
                                      setStatusDialog({ open: true, report });
                                    });
                                  }}
                                >
                                  Ubah Status
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => deleteReport(report.id)}>Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
