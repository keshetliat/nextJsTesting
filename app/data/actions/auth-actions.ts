"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    registerUserService,
    loginUserService,
} from "@/app/data/services/auth-service";
import { loginSchema } from "@/app/types/login-schema";
import { registerSchema } from "@/app/types/register-schema";

// const config = {
//     maxAge: 60 * 60 * 24 * 7, // 1 week fallback
//     path: "/",
//     httpOnly: true, // JWT is NOT visible to browser JS
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax" as const,
// };


export async function registerUserAction(prevState: any, formData: FormData) {
    const validatedFields = registerSchema.safeParse({
        UserName: formData.get("UserName"),
        Password: formData.get("Password"),
    });
    if (!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Register.",
        };
    }
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
            redirect: "/devices"
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

export async function loginUserAction(prevState: any, formData: FormData) {
    const validatedFields = loginSchema.safeParse({
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
            redirect: "/devices"
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
