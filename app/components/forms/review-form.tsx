"use client"

import { useForm } from "react-hook-form"
import { ReviewSchema, zReviewSchema } from "@/app/types/review-schema";
import { useState } from "react";
import { SubmitButton } from "@/app/components/custom/submit-button";
import { StrapiErrors } from "@/app/components/custom/strapi-errors";
import { ZodErrors } from "@/app/components/custom/zod-errors";
import { addCustomerReview } from "@/app/data/services/review-service";

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
    ReviewRating?: string[];
    NickName?: string[];
    ReviewContent?: string[];
}

interface FormState {
    zodErrors: ZodErrorFields | null;
    strapiErrors: { message: string } | null;
    success: boolean;
    redirect: string | null;
    message: string | null;
}

interface ReviewFormProps {
    productID: string;
    isOpen: boolean;
    onClose: () => void;
}

const INITIAL_STATE = {
    data: null,
    zodErrors: null,
    strapiErrors: null,
    message: "",
    success: false,
    redirect: "",
};

export default function ReviewForm({ productID, isOpen, onClose }: ReviewFormProps) {
    const form = useForm<zReviewSchema>({
        defaultValues: {
            ReviewRating: 0,
            NickName: "",
            ReviewContent: "",
        },
    });
    
    const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setFormState(INITIAL_STATE);

        const formData = new FormData(e.currentTarget);
        const reviewData = {
            ReviewRating : Number(formData.get("ReviewRating")),
            NickName: formData.get("NickName") as string,
            ReviewContent: formData.get("ReviewContent") as string,
        };

        // Client-side validation
        const result = ReviewSchema.safeParse(reviewData);

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
            // Validate productID before making the API call
            if (!productID) {
                setFormState({
                    ...INITIAL_STATE,
                    strapiErrors: { message: "Product ID is missing. Please refresh the page and try again." },
                    zodErrors: null,
                    message: "Product ID is missing.",
                });
                setLoading(false);
                return;
            }

            const response = await addCustomerReview(reviewData, productID);

            if (!response) {
                setFormState({
                    ...INITIAL_STATE,
                    strapiErrors: null,
                    zodErrors: null,
                    message: "Something went wrong. Please try again.",
                });
            } else if (response.isSucceed) {
                setFormState({
                    ...INITIAL_STATE,
                    success: true,
                    message: "Review submitted successfully!",
                });
                if (onClose) onClose();
            } else {
                setFormState({
                    ...INITIAL_STATE,
                    strapiErrors: { message: "Failed to submit review." },
                    zodErrors: null,
                    message: "Failed to submit review.",
                });
            }
        } catch (error) {
            setFormState({
                ...INITIAL_STATE,
                strapiErrors: { message: "An error occurred. Please try again." },
                zodErrors: null,
                message: "Failed to submit review.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>הוספת ביקורת</CardTitle>
                <CardDescription>הוסף את הביקורת שלך על הספר</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="ReviewRating">Review Rate (1-5):</Label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                {...form.register("ReviewRating")}
                                required
                            />
                            <ZodErrors error={formState.zodErrors?.ReviewRating ?? []} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="Nickname">Nickname</Label>
                            <input
                                type="text"
                                {...form.register("NickName")}
                                required
                            />
                            <ZodErrors error={formState.zodErrors?.NickName ?? []} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="Description">מה חשבת על הספר?</Label>
                            <textarea
                                {...form.register("ReviewContent")}
                            />
                            <ZodErrors error={formState.zodErrors?.ReviewContent ?? []} />
                        </div>
                        <SubmitButton
                            loading={loading}
                            text="פרסום חוות דעת"
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

    )
}