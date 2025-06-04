"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";

interface StatusUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  reportId: number;
  reportTitle: string;
  onStatusUpdate: (newStatus: string, reason?: string) => void;
}

const statusConfig = {
  in_review: {
    icon: <Clock className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Sedang Ditinjau",
  },
  verified: {
    icon: <CheckCircle className="h-5 w-5" />,
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Terverifikasi",
  },
  rejected: {
    icon: <XCircle className="h-5 w-5" />,
    color: "bg-red-100 text-red-800 border-red-200",
    label: "Ditolak",
  },
};

export function StatusUpdateDialog({
  isOpen,
  onClose,
  currentStatus,
  reportId,
  reportTitle,
  onStatusUpdate,
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const availableStatuses: Record<string, string[]> = {
    in_review: ["verified", "rejected"],
    verified: ["in_review", "rejected"],
    rejected: ["in_review", "verified"],
  };

  const selectStatusDes: Record<string, string> = {
    in_review: "Tandai laporan ini sebagai sedang ditinjau",
    verified: "Tandai laporan ini sebagai telah diverifikasi dan valid",
    rejected: "Tolak laporan ini karena informasi tidak valid",
  };

  const submitDes: Record<string, string> = {
    in_review: "peninjauan",
    verified: "terverifikasi",
    rejected: "ditolak",
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast({
        title: "Status diperlukan",
        description:
          "Silakan pilih status terlebih dahulu untuk memperbarui laporan.",
        variant: "destructive",
      });
      return;
    }

    if (selectedStatus === "rejected" && !reason.trim()) {
      toast({
        title: "Alasan diperlukan",
        description: "Silakan berikan alasan untuk menolak laporan ini.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("pollution_reports")
        .update({
          status: selectedStatus,
          rejected_reason : selectedStatus == 'rejected' ? reason : null
        })
        .eq("id", reportId);

      onStatusUpdate(selectedStatus, reason);

      toast({
        title: "Status berhasil diubah",
        description: `Laporan dalam status ${submitDes[selectedStatus]}.`,
      });

      setSelectedStatus("");
      setReason("");
      onClose();
    } catch (error) {
      toast({
        title: "Perubahan gagal",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    setReason("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Status Laporan</DialogTitle>
          <DialogDescription>
            Ubah status untuk laporan{" "}
            <span className="font-medium">#{reportId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status Sekarang</Label>
            <div className="flex items-center gap-2">
              <Badge
                className={
                  statusConfig[currentStatus as keyof typeof statusConfig]
                    ?.color
                }
              >
                {statusConfig[currentStatus as keyof typeof statusConfig]?.icon}
                <span className="ml-1">
                  {
                    statusConfig[currentStatus as keyof typeof statusConfig]
                      ?.label
                  }
                </span>
              </Badge>
            </div>
          </div>

          {/* Report Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Laporan</Label>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {reportTitle}
            </p>
          </div>

          {/* New Status Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Pilih Status Baru</Label>
            <div className="grid gap-2">
              {availableStatuses[currentStatus].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                    selectedStatus === status
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/20"
                  }`}
                >
                  <div
                    className={`p-1 rounded ${
                      statusConfig[status as keyof typeof statusConfig]?.color
                    }`}
                  >
                    {statusConfig[status as keyof typeof statusConfig]?.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">
                      {statusConfig[status as keyof typeof statusConfig]?.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectStatusDes[status]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Rejection */}
          {selectedStatus === "rejected" && (
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Alasan Ditolak *
              </Label>
              <Textarea
                id="reason"
                placeholder="Silahkan memberikan alasan atas ketolakan laporan..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Alasan ini akan dikirimkan ke pengguna yang mengirim laporan.
              </p>
            </div>
          )}

          {/* Verification Note */}
          {selectedStatus === "verified" && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-800">
                  Konfirmasi Verifikasi
                </p>
                <p className="text-green-700">
                  Laporan ini akan ditandai sebagai terverifikasi dan akan
                  dimasukkan ke dalam data resmi pemantauan polusi.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
            Batalkan
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || !selectedStatus}
          >
            {isUpdating ? "Mengubah..." : "Ubah Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
