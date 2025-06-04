"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from '@/utils/supabase/client'

interface Profile extends User {
  role_id? : number;
  age? : number;
  phone_number? : string;
  full_name ? : string;
}


interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, isLoading] = useState<boolean>(true);
  const router = useRouter();


  const getProfiles = async (user_id : string) => {
    const {data : profile_data, error : profile_error} = await supabase.from('profiles').select().eq('id', user_id);
    if (profile_data) return profile_data[0];
    return null;
  }

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
    
      if (data.session) {
        const profile = await getProfiles(data.session.user.id);
        if (profile){  
          setUser({
            ...data.session.user,
            ...profile
          })
        }
        else {
          setUser(data.session.user)
        }

        setSession(data.session);
      } 
    
      isLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange( 
     async (_event, session) => {
        
        // if (_event == "PASSWORD_RECOVERY") {
        //     console.log('tes');
        //  }

         if (session){
           const profile = await getProfiles(session.user.id);
           if (profile){
              setUser({
                ...session?.user,
                ...profile
              })
           }else{
              setUser(session?.user);
           }

         }
        setSession(session);
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

    // ✅ Delay routing by 10–50ms to avoid race condition with useRequireAuth
    setTimeout(() => {
      router.push("/");
    }, 50);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
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
