"use client";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import URLS from "@/url/web_url";
import { TransparentHeader } from "@/components/transparent-header";
import Google from "@/components/icons/google";

const schema = z
  .object({
    full_name: z.string().min(1, {
      message: "Name cannot be empty",
    }),
    email: z.string().email().min(1, {
      message: "Email cannot be empty",
    }),
    password: z.string().min(1, {
      message: "Password cannot be empty",
    }),
    confirm_password: z.string().min(1),
  })
  .refine((data) => data.password === data.confirm_password, {
    message:
      "The passwords you entered do not match. Please ensure they are the same",
    path: ["confirm_password"],
  });

type RegisterData = z.infer<typeof schema>;

export default function RegisterPage() {
  const defaultValues = {
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const EnterByGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${URLS.WEB}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const onSubmit = async (value: RegisterData) => {
    try {
      setIsLoading(true);
      const { data, error: reg_error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
      });
      
      if (reg_error) {
        toast({
          title: "Register failed",
          description: reg_error.message,
          variant: "destructive",
        });
        console.error("Sign up error:", reg_error);
        return;
      }

      if (data.user?.id) {
        const { error: db_error } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: value.full_name,
        });

        if (db_error) {
          toast({
            title: "Updating profile failed",
            description: db_error.message,
            variant: "destructive",
          });
          console.error("Updating profile error:", reg_error);
          return;
        }

        toast({
          title: "Register successful",
        });

        router.push("/login");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Register failed",
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
        <TransparentHeader />

        <Card className="w-full max-w-xl py-20 px-20 space-y-0 bg-background mb-0 bottom-0 rounded-md xl:rounded-none">
          <div className="">
            <CardHeader className="space-y-2 ">
              <CardTitle className="text-4xl font-medium text-primary">
                Ayo Mulai
              </CardTitle>
              <CardDescription>Buat akun Anda sekarang</CardDescription>
            </CardHeader>

            <CardContent className="mb-5 space-x-0 space-y-4 justify-center items-center py-2 ">
              <Button
                className="w-full py-[21px] text-sm border"
                variant={"ghost"}
                onClick={EnterByGoogle}
              >
                <Google size={20} />
                Masuk / Daftar dengan Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className=" px-4 text-gray-500 bg-background">
                    atau
                  </span>
                </div>
              </div>
            </CardContent>

            <form onSubmit={handleSubmit(onSubmit)} className=" ">
              <CardContent className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    placeholder="Masukkan Nama"
                    {...register("full_name")}
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>

                    <div className="relative h-fit">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirm_password")}
                        placeholder="Konfirmasi Kata Sandi"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center mr-3">
                        <button
                          tabIndex={-1}
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <span className="text-gray-400">
                            {showConfirmPassword ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeClosed className="h-4 w-4" />
                            )}
                          </span>
                        </button>
                      </div>
                    </div>

                    {errors.confirm_password && (
                      <p className="text-red-500 text-sm">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  className="w-full py-[21px] text-base"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang Daftar..." : "Daftar"}
                </Button>
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
