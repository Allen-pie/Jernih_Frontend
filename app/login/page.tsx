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
import { useAuth } from "@/components/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabase";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";

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

      router.push("/");
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Jernih Water
          </CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="m@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative h-fit">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter Password"
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
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
