"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BarChart,
  FileText,
  Users,
  Waves,
  HelpCircle,
  Compass,
  Newspaper,
} from "lucide-react";
import {
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

// 1) Your nav items
const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Kualitas Air", href: "/analytics", icon: BarChart },
  { title: "Laporkan Pencemaran", href: "/report", icon: FileText },
  { title: "Artikel", href: "/articles", icon: Newspaper },
  { title: "Konservasi", href: "/conservation", icon: Waves },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isAuthPage = [
    "/login",
    "/register",
    "/",
    "/verification-sent",
    "/reset-password",
    "/update-password",
    "/auth/callback"
  ].includes(pathname);


 

  // Add state to track sidebar open/closed
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (isAuthPage) return null;

  return (
    <Sidebar collapsible={isAuthPage ? "none" : "icon"} open={sidebarOpen}>
      <SidebarHeader />
      {/* Show trigger on top if sidebar is closed */}
      {!sidebarOpen && (
        <div className="flex justify-end my-2 mr-2">
          <SidebarTrigger onClick={toggleSidebar} />
        </div>
      )}
      {/* Show trigger next to label if sidebar is open */}
      {sidebarOpen && (
        <div className="flex items-center justify-between px-4 py-2 mb-2 border-b border-gray-300">
          <SidebarGroupLabel className="text-sm text-gray-500">
            Navigasi
          </SidebarGroupLabel>
          <SidebarTrigger onClick={toggleSidebar} />
        </div>
      )}
      <SidebarContent>
        {/* 2) one group for your “main” nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* 3) asChild → Button styling applied to your Link */}
                  <SidebarMenuButton asChild className="mb-2">
                    <Link href={item.href} className={cn(
                            "flex items-center gap-2 transition-all duration-300 ease-in-out hover:border hover:rounded-none hover:border-r-8 hover:border-[#00b2e1] hover:border-t-0 hover:border-b-0 hover:border-l-2",
                            pathname.includes(item.href) && 'border rounded-none border-r-8 border-[#00b2e1] border-t-0 border-b-0 border-l-2',
                            !sidebarOpen && pathname.includes(item.href) && 'border rounded-none border-r-2 border-[#00b2e1] border-t-0 border-b-0 border-l-2'
                     )}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* optional footer group */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
