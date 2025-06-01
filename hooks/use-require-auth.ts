"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/context/auth-context";

const MIN_LOADING_TIME = 400;

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/verification-sent",
  "/reset-password",
  "/dashboard",
  "/analytics",
  "/report",
  "/articles",
  "/conservation",
  "",
];

// Tambahkan pengecekan prefix untuk dynamic route seperti /articles/[id]
function isPublicRoute(pathname: string) {
  return (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/articles/")
  );
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), MIN_LOADING_TIME);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && timerDone) {
      if (isPublicRoute(pathname)) {
        setReady(true);
      } else {
        if (!user) {
          console.log('is this true')
          router.push("/login");
        } else {
          setReady(true);
        }
      }
    }
  }, [loading, user, pathname, router, timerDone]);

  return !ready;
}
