"use client";
import type React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import WEB_URL from "@/url/web_url";
import { ChevronLeft } from "lucide-react";

const schema = z.object({
  email: z.string().email({ message: "Format email salah" }).min(1, {
    message: "Email tidak boleh kosong",
  }),
});

type LoginData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const defaultValues = {
    email: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (value: LoginData) => {
    try {
      setIsLoading(true);

      const { data: is_email_exists } = await supabase.rpc("email_exists", {
        input_email: value.email,
      });

      if (!is_email_exists) {
        toast({
          title: "Email tidak ditemukan",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(
        value.email,
        {
          redirectTo: `${WEB_URL}/update-password`,
        }
      );

      if (error) {
        toast({
          title: "Terjadi kesalahan",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sukses Mengirim Email",
        description: "Cek email anda untuk mengakses tautan yang dikirimkan.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Terjadi kesalahan",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <main className="waves bg-cover flex min-h-screen bg-background justify-center items-center  p-2 flex-col ">
        <div>
          <div
            className=" flex gap-2 w-fit cursor-pointer  text-white self-start font-semibold mb-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            Kembali
          </div>
          <Card className="w-full max-w-3xl py-10 px-12 space-y-0 bg-background mb-0 bottom-0 rounded-lg">
            <div className="">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-3xl font-medium text-primary">
                  Ubah Kata Sandi
                </CardTitle>
                <CardDescription>
                  Masukkan email anda yang terdaftar. Tautan akan dikirimkan
                  untuk atur ulang kata sandi.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)} className=" ">
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="Masukkan Email"
                      className="py-5"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    className="w-full py-[21px] text-base"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Kirim"}
                  </Button>
                </CardFooter>
              </form>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
