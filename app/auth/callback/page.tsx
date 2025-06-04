"use client"
import { useAuth } from "@/components/context/auth-context";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const { session } = useAuth();
  const router = useRouter();

  const saveProfile = async () => {
    const { data: profile_exists, error } = await supabase.rpc(
      "profile_exists",
      {
        input_uuid: session?.user.id,
      }
    );

    if (error) router.push("/auth/error");

    // google
    if (
      profile_exists == false &&
      session?.user.user_metadata.iss &&
      session?.user.user_metadata.iss == "https://accounts.google.com"
    ) {
      const { error } = await supabase.from("profiles").insert({
        id: session?.user.id,
        full_name: session?.user.user_metadata.name,
      });

      if (error) {
        console.error("Error saving user data: ", error);
        router.push("/auth/error");
      }

      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (session) saveProfile();
  }, [session, saveProfile]);

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="animate-spin h-16 w-16 rounded-full border-t-4 border-blue-500 border-solid" />
    </div>
  );
}
