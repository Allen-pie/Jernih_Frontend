import { useEffect, useState } from "react";
import { supabase } from "@/supabase";

export function useLogoImage(path: string) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase
          .from("assets")
          .select("path")
          .limit(1)
          .single();

        if (error) throw error;

        if (data?.path) {
          const { data: publicUrlData, error: publicUrlError } =
            supabase.storage.from("jernih").getPublicUrl(data.path);

          if (publicUrlError) throw publicUrlError;

          setLogoUrl(publicUrlData.publicUrl);
        }
      } catch (error: any) {
        console.error("Error fetching logo image:", error.message);
      }
    };

    fetchLogo();
  }, [path]);

  return logoUrl;
}
