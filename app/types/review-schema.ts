import { z } from "zod";

export const ReviewSchema = z.object({
    ReviewRating: z.coerce.number().min(1).max(5, {
        message: "Review rate must be between 1 and 5",
    }),
    NickName: z.string().min(2).max(50, {
        message: "Nickname must be between 2 and 50 characters",
    }),
    ReviewContent: z.string().max(500, {
        message: "Description must be less than 500 characters",
    }).optional(),
});

export type zReviewSchema = z.infer<typeof ReviewSchema>;