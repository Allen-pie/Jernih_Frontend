"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { useState } from "react";

export default function Home() {

  const [count, setCounter] = useState<number>(0);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <h1 className="text-4xl font-bold mb-4">Welcome to My Homepage</h1>
          <Button onClick={() => setCounter(e => e+1) } variant={"destructive"}>
            Click Me
          </Button>
          <h1>{count}</h1>
    </div>
  );
}
