"use client";
import Link from "next/link";
import { User, LogOut , KeyIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "./context/auth-context";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { signOut, session } = useAuth();
  const router = useRouter();
  const { setOpen, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const isAuthPage = ["/", "/login", "/register", "/update-password", "/reset-password", '/admin'].includes(pathname) || pathname.startsWith('/auth');
  
  if (isAuthPage ) {
    return null;
  }

  const closeSidebar = () => {
    setOpen(false);
    setOpenMobile(false);
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link href="/">
        <Image
          src={'/assets/jernihLogo.svg'}
          width={150}
          height={100}
          alt="Jernih Logo"
          className="transition-opacity duration-300 opacity-100 cursor-pointer"
          priority
        />
      </Link>
      <div className="ml-auto flex items-center gap-4">
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
                  onClick={() => router.push('/update-password')}
                >
                  <KeyIcon className="h-4 w-4" />
                  <h4 className="font-medium leading-none">Ubah Kata Sandi</h4>
                </Button>

                 <Button
                  className="justify-start"
                  variant="ghost"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  <h4 className="font-medium leading-none">Keluar</h4>
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
