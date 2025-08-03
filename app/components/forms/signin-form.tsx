'use client';

import { useState } from "react";
import Link from "next/link";
import { loginUserService } from "@/app/data/services/auth-service";
import { ZodErrors } from "@/app/components/custom/zod-errors";
import { StrapiErrors } from "@/app/components/custom/strapi-errors";
import { SubmitButton } from "@/app/components/custom/submit-button";
import { z } from "zod";
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

const INITIAL_STATE: FormState = {
  zodErrors: null,
  strapiErrors: null,
  success: false,
  redirect: null,
  message: null,
};

const schemaLogin = z.object({
  UserName: z.string().min(3).max(50, {
    message: "Username/Email must be between 3 and 50 characters",
  }),
  Password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
});

export function SigninForm() {
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

    const result = schemaLogin.safeParse(userData);

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

      if (response?.message === "SuccessLogin" || response?.message === "Login successful!") {
        setFormState({
          ...INITIAL_STATE,
          success: true,
          message: "Login successful!",
          redirect: "/devices", //maybe in the future use this state on useEffect
        });
        window.location.href = "/devices";
        return;
      } else {
        setFormState({
          ...INITIAL_STATE,
          strapiErrors: { message: response?.error || response?.message },
          success: false,
        });
      }
    } catch (error) {
      setFormState({
        ...INITIAL_STATE,
        strapiErrors: { message: "Something went wrong." },
        success: false,
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="UserName">UserName</Label>
              <Input
                id="UserName"
                name="UserName"
                type="text"
                placeholder="username or email"
                required
              />
              <ZodErrors error={formState?.zodErrors?.UserName ?? []} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Password">Password</Label>
              <Input
                id="Password"
                name="Password"
                type="password"
                placeholder="Password"
                required
              />
              <ZodErrors error={formState?.zodErrors?.Password ?? []} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <SubmitButton
              className="w-full"
              text="Sign In"
              loadingText="Signing in..."
              loading={loading}
            />
            <StrapiErrors error={formState?.strapiErrors ? { ...formState.strapiErrors, name: '', status: null } : null} />
            {formState?.success && formState?.message && (
              <StrapiErrors
                error={{ message: formState.message, name: '', status: null }}
                isSuccess={true}
              />
            )}
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don't have an account?
          <Link className="underline ml-2" href="/signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
