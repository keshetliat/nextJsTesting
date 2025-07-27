"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import {
    registerUserService,
    loginUserService,
} from "@/app/data/services/auth-service";

const config = {
    maxAge: 60 * 60 * 24 * 7, // 1 week fallback
    path: "/",
    httpOnly: true, // JWT is NOT visible to browser JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
};

const schemaRegister = z.object({
    UserName: z.string().min(3).max(20, {
        message: "UserName must be between 3 and 20 characters",
    }),
    Password: z.string().min(6).max(100, {
        message: "Password must be between 6 and 100 characters",
    }),
});

export async function registerUserAction(prevState: any, formData: FormData) {
    const validatedFields = schemaRegister.safeParse({
        UserName: formData.get("UserName"),
        Password: formData.get("Password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing Fields. Failed to Register.",
        };
    }

    // Map to RegisterUserProps
    const userData = {
        UserName: validatedFields.data.UserName,
        Password: validatedFields.data.Password,
    };

    const responseData = await registerUserService(userData);

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: { message: responseData.error },
            zodErrors: null,
            message: "Failed to Register.",
        };
    }

    // Only check for success message, do not expect token
    if (responseData.message === "SuccessRegister") {
        return {
            ...prevState,
            success: true,
            message: "Registration successful!",
            redirect: "/dashboard"
        };
    } else {
        return {
            ...prevState,
            strapiErrors: { message: responseData.message || "Failed to Register." },
            zodErrors: null,
            message: "Failed to Register.",
        };
    }
}

const schemaLogin = z.object({
    UserName: z.string().min(3).max(50, {
        message: "Username/Email must be between 3 and 50 characters",
    }),
    Password: z.string().min(6).max(100, {
        message: "Password must be between 6 and 100 characters",
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
    const validatedFields = schemaLogin.safeParse({
        UserName: formData.get("UserName"),
        Password: formData.get("Password"),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Login.",
        };
    }

    // Map to SignInUserProps
    const userData = {
        UserName: validatedFields.data.UserName,
        Password: validatedFields.data.Password,
    };

    const responseData = await loginUserService(userData);

    if (!responseData) {
        return {
            ...prevState,
            strapiErrors: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: { message: responseData.error },
            zodErrors: null,
            message: "Failed to Login.",
        };
    }

    // Only check for success message, do not expect token
    if (responseData.message === "SuccessLogin") {
        return {
            ...prevState,
            success: true,
            message: "Login successful!",
            redirect: "/dashboard"
        };
    } else {
        return {
            ...prevState,
            strapiErrors: { message: responseData.message || "Failed to Login." },
            zodErrors: null,
            message: "Failed to Login.",
        };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.set("jwt", "", { path: "/", maxAge: 0 });
    redirect("/signin"); // or "/signin"
  }
