// hooks/useHeroImage.ts
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";

export function useHeroImage(path: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("path")
        .is("model_id", null)
        .eq("path", path);

      if (error || !data?.length) return;

      const { data: publicUrl } = supabase.storage.from("jernih").getPublicUrl(data[0].path);
      setUrl(publicUrl?.publicUrl || null);
    };

    fetchImage();
  }, [path]);

  return url;
}
