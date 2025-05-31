"use client";

import { useState } from "react";
import { supabase } from '@/utils/supabase/client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // ✅ your custom toast system

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // ✅ use custom toast hook

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Email tidak valid",
        description: "Silakan masukkan alamat email yang benar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("subscriptions").insert([{ email }]);
    setLoading(false);

    if (error) {
      toast({
        title: "Gagal bergabung",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil bergabung!",
        description: "Terima kasih telah bergabung bersama kami!",
      });
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Alamat email Anda"
        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        disabled={loading}
      />
      <Button
        className="bg-white text-cyan-700 hover:bg-cyan-50"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Memproses..." : "Bergabung"}
      </Button>
    </div>
  );
}
