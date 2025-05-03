"use client";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabase";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";

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

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const onSubmit = async (value: RegisterData) => {
    // console.log('alamak')
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
      }

      toast({
        title: "Register successful",
      });

      router.push("/login");
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input placeholder="Enter Full Name" {...register("full_name")} />
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
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="h-fit relative">
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>

              <div className="relative h-fit">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password")}
                  placeholder="Confirm Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-3">
                  <button
                    tabIndex={-1}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          </CardContent>
        

        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Create Account"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
}
