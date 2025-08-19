import { z } from "zod";

export const ReviewSchema = z.object({
    ReviewRating: z.number().int().min(1).max(5, {
        message: "Review rate must be between 1 and 5",
    }),
    NickName: z.string().min(2).max(50, {
        message: "Nickname must be between 2 and 50 characters",
    }),
    ReviewContent: z.string().min(1, {
        message: "Review content is required",
    }).max(500, {
        message: "Description must be less than 500 characters",
    }),
});

export type zReviewSchema = z.infer<typeof ReviewSchema>;