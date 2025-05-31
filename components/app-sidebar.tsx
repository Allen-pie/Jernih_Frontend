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

// 1) Your nav items
const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Water Quality", href: "/analytics", icon: BarChart },
  { title: "Report Pollution", href: "/report-form", icon: FileText },
  { title: "Articles", href: "/articles", icon: Newspaper },
  { title: "Conservation", href: "/conservation", icon: Waves },
];

export function AppSidebar() {
  const pathname = usePathname();
  // kalo page ini g ada sidebarnya
  const isAuthPage = [
    "/login",
    "/register",
    "/",
    "/verification-sent",
    "/reset-password",
    '/update-password'
  ].includes(pathname);

  if (isAuthPage) {
    return null;
  }

  return (
    <Sidebar collapsible={isAuthPage ? "none" : "icon"}>
      {/* you can drop a logo or title here if you like */}
      <SidebarHeader />

      <SidebarContent>
        {/* 2) one group for your “main” nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-sm text-gray-500 mb-2 border-b border-gray-300">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* 3) asChild → Button styling applied to your Link */}
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center gap-2">
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
            <SidebarMenuButton asChild>
              <Link href="/resources" className="flex items-center gap-2">
                <HelpCircle className="size-4" />
                <span>Education & Resources</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      
    </Sidebar>
  );
}
