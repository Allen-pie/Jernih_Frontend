"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/context/auth-context";
import { supabase } from '@/utils/supabase/client'
import WEB_URL from "@/url/web_url";

export default function VerificationSentPage() {
  const [isResending, setIsResending] = useState(false);
  const { regEmail, regPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const { toast } = useToast();

  const handleResendVerification = async () => {
    setIsResending(true);

    try {
      const { data, error: reg_error } = await supabase.auth.signUp({       
        email: regEmail,
        password: regPassword,
        options : {
            emailRedirectTo : `${WEB_URL}/login`
        }
      });

      if (reg_error) {
        toast({
          title: "Verification failed send",
          description: reg_error.message,
          variant: "destructive",
        });
        console.error("Sign up error:", reg_error);
        return;
      }

      toast({
        title: "Verification email resent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend",
        description:
          "There was an error resending the verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verification Email Sent
          </CardTitle>
          <CardDescription className="text-base">
            We have sent a verification link to{" "}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-left">
            <h3 className="mb-2 font-medium">Next steps:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-primary shrink-0" />
                <span>Check your email inbox for the verification link</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-primary shrink-0" />
                <span>Click on the link to verify your email address</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-primary shrink-0" />
                <span>Once verified, you can log in to your account</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, please check your spam folder or request
            a new verification link.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Return to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
