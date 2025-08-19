"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUserService } from "@/app/data/services/auth-service";
import { ZodErrors } from "@/app/components/custom/zod-errors";
import { StrapiErrors } from "@/app/components/custom/strapi-errors";
import { SubmitButton } from "@/app/components/custom/submit-button";
import { registerSchema } from "@/app/types/register-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/ui/card";
import { Label } from "@/app/components/ui/ui/label";
import { Input } from "@/app/components/ui/ui/input";

// Define the type for zodErrors
interface ZodErrorFields {
  UserName?: string[];
  Password?: string[];
}

interface FormState {
  zodErrors: ZodErrorFields | null;
  strapiErrors: { message: string } | null;
  success: boolean;
  redirect: string | null;
  message: string | null;
}

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  success: false,
  redirect: null,
  message: null,
};

export default function SignupForm() {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      UserName: formData.get("UserName") as string,
      Password: formData.get("Password") as string,
    };

    const result = registerSchema.safeParse(userData);

    if (!result.success) {
      setFormState({
        ...INITIAL_STATE,
        zodErrors: result.error.flatten().fieldErrors,
        strapiErrors: null,
        success: false,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await registerUserService(userData);

      if (response?.message === "SuccessRegister" || response?.message === "Registration successful!") {
        setFormState({
          ...INITIAL_STATE,
          success: true,
          message: "Registration successful!",
          redirect: "/",
        });
        window.location.href = "/";
        return;
      } else {
        setFormState({
          ...INITIAL_STATE,
          strapiErrors: { message: response?.error || "Register failed." },
          success: false,
        });
      }
    } catch (error) {
      setFormState({
        ...INITIAL_STATE,
        strapiErrors: { message: "An error occurred. Please try again." },
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="UserName">Username</Label>
              <Input
                id="UserName"
                name="UserName"
                placeholder="Enter your username"
                required
              />
              <ZodErrors error={formState.zodErrors?.UserName ?? []} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="Password">Password</Label>
              <Input
                id="Password"
                name="Password"
                type="password"
                placeholder="Enter your password"
                required
              />
              <ZodErrors error={formState.zodErrors?.Password ?? []} />
            </div>
            <SubmitButton 
              loading={loading} 
              text="Register"
              loadingText="Registering..."
            />
            <StrapiErrors 
              error={formState.strapiErrors ? {
                message: formState.strapiErrors.message,
                name: '',
                status: null
              } : null} 
              isSuccess={formState.success} 
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}