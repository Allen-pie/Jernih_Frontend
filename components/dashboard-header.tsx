"use client";
import Link from "next/link";
import { Search, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "./context/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLogoImage } from "@/hooks/useLogoImage";

export function DashboardHeader() {
  const { signOut, session } = useAuth();

  const { setOpen, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const isAuthPage = ["/login", "/register"].includes(pathname);

  const closeSidebar = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  const logoUrl = useLogoImage("jernih-logo.svg");

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      {!isAuthPage && <SidebarTrigger />}
      {logoUrl ? (
        <Image src={logoUrl} width={150} height={100} alt="Jernih Logo" />
      ) : (
        <span className="h-8 w-8 mr-2 bg-white text-blue-800 font-bold flex items-center justify-center rounded">
          Jernih
        </span>
      )}
      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-64 pl-8" />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        {session ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="grid gap-4">
                <Button
                  className="justify-start"
                  variant="ghost"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <h4 className="font-medium leading-none">Log Out</h4>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" onClick={closeSidebar}>
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button onClick={closeSidebar}>Register</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
