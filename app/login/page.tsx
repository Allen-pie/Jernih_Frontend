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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import Google from "@/components/icons/google";
import WEB_URL from "@/url/web_url";
import { TransparentHeader } from "@/components/transparent-header";

const schema = z.object({
  email: z.string().email().min(1, {
    message: "Email cannot be empty",
  }),
  password: z.string().min(1, {
    message: "Password cannot be empty",
  }),
});

type LoginData = z.infer<typeof schema>;

export default function LoginPage() {
  const defaultValues = {
    email: "",
    password: "",
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loginByGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${WEB_URL}/dashboard`,
        queryParams : {
          prompt : 'select_account'
        }
      },
    });
  };

  const onSubmit = async (value: LoginData) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        ...value,
      });
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Sign in error:", error);
        return;
      }

      toast({
        title: "Login successful",
      });

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Login failed",
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
      <main className="waves bg-cover flex min-h-screen bg-background flex-col xl:flex-row  items-center xl:items-stretch p-2 xl:p-0 ">
        <TransparentHeader/>
        <Card className="w-full max-w-xl py-20 px-20 space-y-0 bg-background mb-0 bottom-0 rounded-md xl:rounded-none">
          
          <div className="">
            <CardHeader className="space-y-2 ">
              <CardTitle className="text-4xl font-medium text-primary">
                Halo
              </CardTitle>
              <CardDescription>Masuk ke akun anda</CardDescription>
            </CardHeader>

            <CardContent className="mb-5 space-x-0 space-y-4 justify-center items-center  py-4 ">
              <Button
                className="w-full py-[21px] text-sm border"
                variant={"ghost"}
                onClick={loginByGoogle}
              >
                <Google size={20} />
                Masuk / Daftar dengan Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className=" px-4 text-gray-500 bg-background">atau</span>
                </div>
              </div>
              
            </CardContent>

            <form onSubmit={handleSubmit(onSubmit)} className=" ">
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Link
                      href="/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Ubah Kata Sandi
                    </Link>
                  </div>

                  <div className="relative h-fit">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Masukkan Kata Sandi"
                      className="py-5"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center mr-3">
                      <button
                        tabIndex={-1}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="text-gray-400">
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeClosed className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
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
                  {isLoading ? "Sedang masuk..." : "Masuk"}
                </Button>
                <div className="text-center text-sm">
                  Belum punya akun?{" "}
                  <Link href="/register" className="text-primary underline">
                    Daftar Sekarang
                  </Link>
                </div>
              </CardFooter>
            </form>
          </div>
        </Card>

        <div className="background waves items-center justify-center hidden xl:flex">
          <div className="relative max-w-lg text-center">
            <div className="absolute text-8xl font-bold text-background opacity-80 md:-left-16 md:-top-12 md:text-9xl font-serif">
              &ldquo;
            </div>
            <blockquote className="relative z-10 text-3xl font-medium  leading-relaxed text-background  md:leading-loose">
              Dari Pencemaran ke Perubahan.
            </blockquote>
          </div>
        </div>

      </main>
    </div>
  );
}
