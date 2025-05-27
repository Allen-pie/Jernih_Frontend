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
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive", // optional if you support variants
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("subscriptions").insert([{ email }]);
    setLoading(false);

    if (error) {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscribed!",
        description: "Thanks for subscribing!",
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
        placeholder="Your email address"
        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        disabled={loading}
      />
      <Button
        className="bg-white text-cyan-700 hover:bg-cyan-50"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
    </div>
  );
}
