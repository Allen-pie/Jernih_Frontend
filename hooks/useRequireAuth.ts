"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

const MIN_LOADING_TIME = 400;

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  const publicRoutes = ["/", "/login", "/register", "/verification-sent"];

  // ⏳ Always start a minimum delay to allow loading screen to appear
  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), MIN_LOADING_TIME);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && timerDone) {
      if (publicRoutes.includes(pathname)) {
        setReady(true);
      } else {
        if (!user) {
          router.push("/login");
        } else {
          setReady(true);
        }
      }
    }
  }, [loading, user, pathname, router, timerDone]);

  // 🧠 This means: block layout until timer & auth check are both ready
  return !ready;
}
