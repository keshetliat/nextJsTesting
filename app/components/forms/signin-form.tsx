'use client';

import { useState } from "react";
import { SubmitButton } from "@/app/components/custom/submit-button";
import { StrapiErrors } from "@/app/components/custom/strapi-errors";
import { ZodErrors } from "@/app/components/custom/zod-errors";
import { loginUserService } from "@/app/data/services/auth-service";
import { loginSchema } from "@/app/types/login-schema";
import { Label } from "@/app/components/ui/ui/label";
import { Input } from "@/app/components/ui/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/ui/card";

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
  data: null,
  zodErrors: null,
  strapiErrors: null,
  message: "",
  success: false,
  redirect: "",
};

export default function SigninForm() {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormState(INITIAL_STATE);

    const formData = new FormData(e.currentTarget);
    const userData = {
      UserName: formData.get("UserName") as string,
      Password: formData.get("Password") as string,
    };

    // Client-side validation
    const result = loginSchema.safeParse(userData);

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
      const response = await loginUserService(userData);

      if (!response) {
        setFormState({
          ...INITIAL_STATE,
          strapiErrors: null,
          zodErrors: null,
          message: "Ops! Something went wrong. Please try again.",
        });
      } else if (response.error) {
        setFormState({
          ...INITIAL_STATE,
          strapiErrors: { message: response.error },
          zodErrors: null,
          message: "Failed to Login.",
        });
      } else if (response.message === "SuccessLogin") {
        setFormState({
          ...INITIAL_STATE,
          success: true,
          message: "Login successful!",
          redirect: "/dashboard",
        });
        window.location.href = "/dashboard";
        return;
      } else {
        setFormState({
          ...INITIAL_STATE,
          strapiErrors: { message: response.message || "Failed to Login." },
          zodErrors: null,
          message: "Failed to Login.",
        });
      }
    } catch (error) {
      setFormState({
        ...INITIAL_STATE,
        strapiErrors: { message: "An error occurred. Please try again." },
        zodErrors: null,
        message: "Failed to Login.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
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
              text="Login"
              loadingText="Logging in..."
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
    </Card>
  );
}
