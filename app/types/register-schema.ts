import { z } from "zod";

export const registerSchema = z.object({
    UserName: z.string().min(3).max(50, {
        message: "Username/Email must be between 3 and 50 characters",
    }),
    Password: z.string().min(6).max(100, {
        message: "Password must be between 6 and 100 characters",
    }),
});