'use client'

import { useState, useEffect, useRef } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/ui/ui/popover";
import { Button } from "@/app/components/ui/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/components/ui/ui/form";
import { Input } from "@/app/components/ui/ui/input";
import { Textarea } from '@/app/components/ui/ui/textarea';

// Form handling & validation
import { ReviewSchema, zReviewSchema } from '../../types/review-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Animation & styling
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addCustomerReview } from '@/app/data/services/review-service';

// Form state interface - tracks success/error messages
interface FormState {
    strapiErrors: { message: string } | null; // Backend errors
    success: boolean;  // Whether submission succeeded
    message: string | null; // General message to display
}

// Props interface - component receives productID from parent
interface ReviewsFormProps {
    productID: string | number;
}

const INITIAL_STATE: FormState = {
    strapiErrors: null,
    success: false,
    message: null,
};

export default function ReviewsForm({ productID }: ReviewsFormProps) {
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
    const [isOpen, setIsOpen] = useState(false); // Controls popup open/close
    // Reference to popup content (for potential DOM manipulation)
    const popoverRef = useRef<HTMLDivElement>(null);

    const form = useForm<zReviewSchema>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            ReviewRating: 0,
            ReviewContent: '',
            NickName: '',
        },
    })

    // Function to close the popup
    const closePopup = () => {
        setIsOpen(false);
        setFormState(INITIAL_STATE);
        form.reset(); // Clear form fields
    };

    // Auto-close popup after 2 seconds on successful submission (for testing)
    useEffect(() => {
        if (formState.success) { // Only start timer when review is successfully submitted
            const timer = setTimeout(() => {
                closePopup();  // Close popup after 2 seconds
            }, 2 * 1000);  // 2 seconds = 2000 milliseconds

            return () => {
                clearTimeout(timer);// Cleanup timer if component unmounts
            };
        }
    }, [formState.success]);// Runs whenever formState.success changes

    // Alternative close method - try to force close by simulating outside click
    const forceClosePopup = () => {
        setIsOpen(false);
        setFormState(INITIAL_STATE);
        form.reset();
        
        // Try to force close by dispatching a click event outside
        setTimeout(() => {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.body.dispatchEvent(event);
        }, 100);
    };

    // Debug effect to see when isOpen changes
    useEffect(() => {
    }, [isOpen]);

    async function onSubmit(values: zReviewSchema) {
        if (!productID) {
            setFormState({
                ...INITIAL_STATE,
                strapiErrors: { message: "Product ID is missing. Please refresh the page and try again." },
                message: "Product ID is missing.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await addCustomerReview(values, productID.toString());
            
            if (!response) {
                setFormState({
                    ...INITIAL_STATE,
                    message: "Something went wrong. Please try again.",
                });
            } else if (response.isSucceed) {
                setFormState({
                    ...INITIAL_STATE,
                    success: true,
                    message: "Review submitted successfully!",
                });
                // Reset form after successful submission
                form.reset();
            } else {
                setFormState({
                    ...INITIAL_STATE,
                    strapiErrors: { message: "Failed to submit review." },
                    message: "Failed to submit review.",
                });
            }
        } catch (error) {
            setFormState({
                ...INITIAL_STATE,
                strapiErrors: { message: "An error occurred. Please try again." },
                message: "Failed to submit review.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className='fw-full'>
                    <Button className='font-medium w-full' variant={"secondary"}>הוספת </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80" ref={popoverRef}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">הוספת ביקורת</h3>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={forceClosePopup}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Display form state messages */}
                        {formState.message && (
                            <div className={`p-3 rounded-md text-sm ${
                                formState.success 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                                {formState.message}
                            </div>
                        )}
                        
                        <FormField 
                            control={form.control} 
                            name="ReviewRating" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>הדירוג שלך לספר (1-5)</FormLabel>
                                    <FormControl>
                                        <input type="hidden" {...field} />
                                    </FormControl>
                                    <div className='flex items-center gap-2'>
                                        {[1, 2, 3, 4, 5].map((value) => {
                                            return (
                                                <motion.div
                                                    className='relative cursor-pointer'
                                                    whileTap={{ scale: 0.8 }}
                                                    whileHover={{ scale: 1.2 }}
                                                    key={value}>
                                                    <Star 
                                                        onClick={() => {
                                                            form.setValue('ReviewRating', value)
                                                        }}
                                                        fill={value <= form.watch('ReviewRating') ? 'yellow' : 'none'}
                                                        className={cn(
                                                            'text-primary bg-transparent tr transition-all duration-300 ease-in-out',
                                                            value ? "text-primary" : "text-muted"
                                                        )}
                                                    />
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        
                        <FormField 
                            control={form.control} 
                            name="NickName" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>כינוי</FormLabel>
                                    <FormControl>
                                        <Input placeholder='הכינוי שלך' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        
                        <FormField 
                            control={form.control} 
                            name="ReviewContent" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>תגובה</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='מה חשבת על הספר? אהבת? התרגשת?' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        
                        <Button type='submit' className='w-full' disabled={loading}>
                            {loading ? 'שולח...' : 'הוספת הביקורת'}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}