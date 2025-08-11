'use client'

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Stars({ rating, totalRevies, size = 14 }: {
    rating: number,
    totalRevies: number,
    size?: number
}) {
    // Ensure rating is a valid number
    const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
   
    return (
        <div className="flex items-center py-4">
            {[1, 2, 3, 4, 5].map((star) => {
                const starValue = star;
                const isFullyFilled = validRating >= starValue;
                const isPartiallyFilled = validRating >= starValue - 1 && validRating < starValue;
                
                // Calculate fill percentage for partial stars
                let fillPercentage = 0;
                if (isFullyFilled) {
                    fillPercentage = 100;
                } else if (isPartiallyFilled) {
                    // Calculate how much of this star should be filled
                    fillPercentage = Math.max(0, Math.min(100, (validRating - (starValue - 1)) * 100));
                }
                
                return (
                    <div key={star} className="relative">
                        {/* Background star (empty) */}
                        <Star 
                            size={size} 
                            className="absolute inset-0 transition-all duration-300 ease-in-out"
                            style={{
                                fill: 'transparent',
                                color: '#d1d5db' // gray-300
                            }}
                        />
                        
                        {/* Foreground star (filled) */}
                        <Star 
                            size={size} 
                            className="relative transition-all duration-300 ease-in-out"
                            style={{
                                fill: fillPercentage > 0 ? '#fbbf24' : 'transparent', // yellow-400
                                color: fillPercentage > 0 ? '#fbbf24' : 'transparent',
                                clipPath: fillPercentage === 100 ? 'none' : `inset(0 ${100 - fillPercentage}% 0 0)`
                            }}
                        />
                    </div>
                );
            })}
            <span className="text-secondary-foreground font-bold text-sm ml-2 px-4">סה"כ ביקורות: {totalRevies}</span>
        </div>
    )
}