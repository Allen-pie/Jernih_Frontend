"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useRequireAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-blue-500 border-solid" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <main>{children}</main>
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  );
}
