"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";
import {  Eye, EyeClosed } from "lucide-react";
import AnimatedCheckCircle from "@/components/icons/animated-circle-check";
import { ChevronLeft } from "lucide-react";

export default function UpdatePasswordPage() {
  
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isLengthValid, setIsLengthValid] = useState<boolean>(false);
  const [isUppercaseValid, setIsUppercaseValid] = useState<boolean>(false);
  const [isLowercaseValid, setIsLowercaseValid] = useState<boolean>(false);
  const [haveNumORSymbol, setHaveNumORSymbol] = useState<boolean>(false);
  const [isSuccessfull, setIsSuccessfull] = useState<boolean>(false);

  const onSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({password})

      if (error) {
        toast({
          title: "Terjadi Kesalahan",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Kata Sandi Berhasil Diubah",
      });

      setIsSuccessfull(true);
      setTimer(5);

    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Terjadi Kesalahan",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
    setIsLengthValid(password.length >= 8);
    setIsUppercaseValid(/[A-Z]/.test(password));
    setIsLowercaseValid(/[a-z]/.test(password));
    setHaveNumORSymbol(
      /[!@#$%^&*(),.?":{}|<>+\-_=]/.test(password) || /[0-9]/.test(password)
    );
  }, [password]);

 const [timer, setTimer] = useState<number>(5);
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer == 0 && isSuccessfull)
      return router.push("/dashboard");
  }, [timer]);

  return (
    <div>
      <main className="waves bg-cover flex min-h-screen bg-background justify-center items-center flex-col p-2  ">
        <div>
          <div
            className=" flex gap-2 w-fit cursor-pointer  text-white self-start font-semibold mb-1"
            onClick={() => router.push('/dashboard')}
          >
            <ChevronLeft />
            Kembali ke Dashboard
          </div>
          <Card className="w-full max-w-xl py-10 px-12 space-y-0 bg-background mb-0 bottom-0 rounded-lg">
            <div className="">

              <CardHeader className="space-y-2 text-center ">
                <CardTitle className="text-3xl font-medium text-primary flex flex-col justify-center items-center">
                  {isSuccessfull && (
                    <AnimatedCheckCircle className="mb-5"/>
                  )}

                  {isSuccessfull ? 'Kata Sandi Berhasil Diubah' : 'Ubah Kata Sandi'}
                </CardTitle>
                <CardDescription className={cn(
                  isSuccessfull && 'w-fit'
                )}>{isSuccessfull ? `Anda akan secara otomatis diarahkan ke halaman utama dalam ${timer} detik` : 'Masukkan kata sandi baru'}</CardDescription>

            
              </CardHeader>
              {!isSuccessfull && (
              <form onSubmit={onSubmit} className=" ">
                <CardContent className="space-y-5">
                  <div className="relative h-fit">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi baru"
                      onChange={(e) => setPassword(e.target.value)}
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

                  <div className="justify-start sm:text-sm text-xs gap-1 flex flex-col text-gray-400 pl-2">
                    <p className={cn(
                      isLengthValid && 'text-green-500'
                    )}>Gunakan minimal 8 karakter</p>
                    <p className={cn(
                      isUppercaseValid && 'text-green-500'
                    )}>
                      Wajib ada huruf besar (Minimal 1 Karakter)
                    </p>
                    <p className={cn(
                      isLowercaseValid && 'text-green-500'
                    )}>
                      Wajib ada huruf kecil (Minimal 1 Karakter)
                    </p>
                    <p className={cn(
                      haveNumORSymbol && 'text-green-500'
                    )}>
                      Gunakan angka atau simbol khusus (!, @, #, 1 , 2, 3, dll)
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    className="w-full py-[21px] text-base"
                    type="submit"
                    disabled={isLoading || !isLengthValid || !haveNumORSymbol || !isLowercaseValid || !isUppercaseValid}
                  >
                    {isLoading ? "Loading..." : "Ubah"}
                  </Button>
                </CardFooter>
              </form> 
              )}
        

            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
