import { useEffect, useState } from "react";
import { supabase } from '@/utils/supabase/client'

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
          const { data: publicUrlData } =
            supabase.storage.from("jernih").getPublicUrl(data.path);

          setLogoUrl(publicUrlData.publicUrl);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching logo image:", error.message);
        } else {
          console.error("Error fetching logo image:", error);
        }
      }
    };

    fetchLogo();
  }, [path]);

  return logoUrl;
}
