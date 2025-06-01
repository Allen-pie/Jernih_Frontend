"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calendar, AlertTriangle, Eye,  Plus, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getReportsForAdmin } from "@/utils/supabase/report"
import { Report } from "@/app/interfaces"
import { useDebounce } from "@/hooks/use-debounce"
import dayjs from 'dayjs'


// Mock data for pollution reports
// const pollutionReports = [
//   {
//     id: "RPT-001",
//     title: "Chemical Discharge in River Klang",
//     location: "River Klang, Kuala Lumpur",
//     coordinates: { lat: 3.139, lng: 101.6869 },
//     type: "Chemical Discharge",
//     severity: 8,
//     status: "Under Investigation",
//     reportedBy: "Ahmad Rahman",
//     reportedAt: "2024-01-20T10:30:00Z",
//     description:
//       "Strong chemical smell detected near the industrial area. Water appears discolored with an oily film on the surface. Several dead fish observed floating downstream.",
//     contact: "ahmad.rahman@email.com",
//     images: ["image1.jpg", "image2.jpg"],
//     priority: "high",
//   },
//   {
//     id: "RPT-002",
//     title: "Plastic Waste Accumulation",
//     location: "Sungai Gombak, Selangor",
//     coordinates: { lat: 3.2597, lng: 101.6947 },
//     type: "Plastic Waste",
//     severity: 5,
//     status: "Resolved",
//     reportedBy: "Siti Nurhaliza",
//     reportedAt: "2024-01-18T14:15:00Z",
//     description:
//       "Large accumulation of plastic bottles and bags blocking water flow. Local wildlife appears to be affected.",
//     contact: "siti.n@email.com",
//     images: ["image3.jpg"],
//     priority: "medium",
//   },
//   {
//     id: "RPT-003",
//     title: "Oil Spill Near Port Area",
//     location: "Port Klang, Selangor",
//     coordinates: { lat: 3.0319, lng: 101.39 },
//     type: "Oil Spill",
//     severity: 9,
//     status: "In Progress",
//     reportedBy: "Lim Wei Ming",
//     reportedAt: "2024-01-19T08:45:00Z",
//     description:
//       "Significant oil spill observed near the port area. Strong petroleum odor and rainbow-colored film covering approximately 500 square meters of water surface.",
//     contact: "+60123456789",
//     images: ["image4.jpg", "image5.jpg", "image6.jpg"],
//     priority: "high",
//   },
//   {
//     id: "RPT-004",
//     title: "Sewage Overflow",
//     location: "Sungai Pinang, Penang",
//     coordinates: { lat: 5.4164, lng: 100.3327 },
//     type: "Sewage",
//     severity: 6,
//     status: "Pending Review",
//     reportedBy: "Raj Kumar",
//     reportedAt: "2024-01-17T16:20:00Z",
//     description: "Sewage overflow from nearby treatment plant. Foul smell and brown discoloration of water observed.",
//     contact: "raj.kumar@email.com",
//     images: [],
//     priority: "medium",
//   },
//   {
//     id: "RPT-005",
//     title: "Industrial Runoff",
//     location: "Sungai Perak, Perak",
//     coordinates: { lat: 4.5975, lng: 101.0901 },
//     type: "Chemical Discharge",
//     severity: 7,
//     status: "Under Investigation",
//     reportedBy: "Fatimah Ali",
//     reportedAt: "2024-01-16T11:10:00Z",
//     description:
//       "Unusual water coloration and foam formation downstream from industrial complex. pH levels appear abnormal.",
//     contact: "+60198765432",
//     images: ["image7.jpg"],
//     priority: "high",
//   },
// ]

// tes

const statusColors  : Record<string, string> = {
  in_review : "bg-blue-100 text-blue-800 max-w-fit h-5 mt-0.5",
  verified : "bg-green-100 text-green-800 max-w-fit h-5 mt-0.5",
  rejected : "bg-yellow-100 text-yellow-800 max-w-fit h-5 mt-0.5",

}

const severityColor = (severity: string) => {
  if (severity == 'low') return "text-green-600";
  if (severity == 'medium') return "text-yellow-600";
  return "text-red-600"
}


const severityLabels : Record<string, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
}

const statusLabels : Record<string, string> = {
  in_review: 'Sedang Ditinjau',
  verified : 'Terverifikasi',
  rejected : 'Ditolak'
}

const pollutionTypeLabels: Record<string, string> = {
  chemical: "Pembuangan Bahan Kimia",
  oil: "Tumpahan Minyak",
  plastic: "Limbah Plastik",
  sewage: "Limbah Cair",
  other: "Lainnya"
}


export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300); // delay 300ms

  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const [selectedReport, setSelectedReport] = useState<Report | null>(null)


  const getStatusCounts = () => {
    const counts : Record<string, number> = {
     all: reports.length,
     in_review : 0,
     verified : 0,
     rejected : 0
    }

    reports.forEach((report) => {
      counts[report.status]++;
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  
  const getReports = async  () => {
    const data = await getReportsForAdmin() as Report[];
    if (data){
      setReports(data);
    } 
  }

  useEffect(() => {
    getReports();
  },[])



   const filteredAndSortedReports = useMemo(() => {

  
    const filtered = reports.filter((report : Report) => {
        const matchesSearch =
          (report.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (report.location ?? "").toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || report.status === statusFilter
        const matchesType = typeFilter === "all" || report.pollution_type === typeFilter
        // const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesType
    })

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        // case "severity-high":
        //   return b.severity - a.severity
        // case "severity-low":
        //   return a.severity - b.severity
        case "location":
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    return filtered
  }, [debouncedSearch, statusFilter, typeFilter, priorityFilter, sortBy, reports])


  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Laporan Pencemaran</h1>
              <p className="text-muted-foreground mt-1">Memantau dan mengelola seluruh laporan insiden pencemaran</p>
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
                      <SelectItem value="severity-high">Severity (High to Low)</SelectItem>
                      <SelectItem value="severity-low">Severity (Low to High)</SelectItem>
                      <SelectItem value="location">Location (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Tabs */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Semua ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="in_review">Sedang Ditinjau ({statusCounts["in_review"]})</TabsTrigger>
              <TabsTrigger value="verified">Terverifikasi ({statusCounts["verified"]})</TabsTrigger>
              <TabsTrigger value="rejected">Ditolak ({statusCounts["rejected"]})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredAndSortedReports.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Laporan tidak ditemukan</h3>
                    <p className="text-muted-foreground">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedReports.map((report : Report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          
                          <h3 className="text-lg font-semibold">{report.title}</h3>

                          <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                            {statusLabels[report.status!]}
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
                            <AlertTriangle className={`mr-1 h-4 w-4 ${severityColor(report.severity)}`} />
                            Tingkat: {severityLabels[report.severity]}
                          </div>
                          <div>Tipe: {pollutionTypeLabels[report.pollution_type]}</div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Dilaporkan Oleh:</span>{" "}
                            <span className="font-medium">{report.user_name ?? '-'}</span>
                          </div>
                          <div className="flex gap-2">

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                                  <Eye className="mr-1 h-4 w-4" />
                                  Lihat Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{report.title}</DialogTitle>
                                  <DialogDescription>Report ID: {report.id}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <Label className="text-sm font-medium">Lokasi</Label>
                                      <p className="text-sm">{report.location}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Koordinat</Label>
                                      <p className="text-sm">
                                        {report.latitude && report.longitude ? (`${report.latitude} , ${report.longitude}`) : ('-')}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Tipe Pencemaran</Label>
                                      <p className="text-sm">{pollutionTypeLabels[report.pollution_type]}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Tingkat Pencemaran</Label>
                                      <p className={`text-sm font-medium ${severityColor(report.severity)}`}>
                                        {severityLabels[report.severity]}
                                      </p>
                                    </div>

                                    <div className="flex flex-col">
                                      <Label className="text-sm font-medium">Status</Label>
                                      <Badge className={statusColors[report.status]}>
                                        { statusLabels[report.status] }
                                      </Badge>
                                    </div>
                                   
                                    <div>
                                      <Label className="text-sm font-medium">Dilaporkan Oleh</Label>
                                      <p className="text-sm">{report.user_name ?? '-'}</p>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-medium">Contact</Label>
                                      <p className="text-sm">{report.contact}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="text-sm mt-1">{report.description}</p>
                                  </div>

                                  {/* {report.images.length > 0 && (
                                    <div>
                                      <Label className="text-sm font-medium">Images</Label>
                                      <p className="text-sm text-muted-foreground">
                                        {report.images.length} image(s) attached
                                      </p>
                                    </div>
                                  )} */}

                                </div>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                                <DropdownMenuItem>Hapus</DropdownMenuItem>
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
  )
}
