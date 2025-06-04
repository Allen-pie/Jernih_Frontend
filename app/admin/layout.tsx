"use client"

import { useAuth } from "@/components/context/auth-context";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({children} : {children : React.ReactNode}){
    const {session} = useAuth();
    const router = useRouter();
    const [ready, setReady] = useState<boolean>(false);
    
    useEffect(() => {
        if (!session) return router.push('/login');

        const getProfiles = async (user_id : string) => {
            const {data : profile_data} = await supabase.from('profiles').select().eq('id', user_id);
            if (profile_data && profile_data[0].role_id == 1) {
                setReady(true);
            }
            else {
                return router.push("/auth/error");
            }
        }
        
        getProfiles(session.user.id);

    },[router, session])

    if (!ready){
    return <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-blue-500 border-solid" />
      </div>
    }

    return (
        <div>
            {children}
        </div>
    )
}