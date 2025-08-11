import { z } from "zod";

export const reviewsSchema = z.object({
    rating: z.number()
    .min(1, {message: 'Please add at least one star'})
        .max(5, {message: 'please add no more then 5 stars'}),
    comment: z.string().min(10, {message: 'please add at least 10 characters'}),
    nickName: z.string().min(3, {message: 'please add at least 3 characters'}),
});

export type ReviewsSchema = z.infer<typeof reviewsSchema>;

