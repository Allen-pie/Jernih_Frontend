"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  regPassword: string;
  setRegPassword: (password: string) => void;
  setRegEmail: (email: string) => void;
  regEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, isLoading] = useState<boolean>(true);
  const [regPassword, setRegPassword] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);

        console.log("session", session);
      } else {
        console.log("errorw", error);
      }

      isLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        regEmail,
        setRegEmail,
        regPassword,
        setRegPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
