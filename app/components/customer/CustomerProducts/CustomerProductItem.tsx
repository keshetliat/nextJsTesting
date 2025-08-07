'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReviewForm from '@/app/components/forms/review-form';
import { config } from '@/app/config/config';

interface CustomerProductItemProps {
    product: any;
}

export default function CustomerProductItem({ product }: CustomerProductItemProps) {
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    const toggleReviewForm = () => {
        setIsReviewFormOpen(!isReviewFormOpen);
    };

    return (
        <div className="border rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold">{product.ProductName}</h3>
                </div>
                <div>
                    <p className='text-gray-500'>תאריך הזמנה</p>
                    <p className="text-gray-600">
                        {product.OrderDate ? new Date(product.OrderDate).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div>
                    <p className='text-gray-500'>מחיר רכישה</p>
                    <p className="text-sm text-gray-500">Price: {product.PurchasePrice}</p>
                </div>
                <div>
                    <p className='text-gray-500'>סטטוס</p>
                    <p className="text-sm text-gray-500">{product.ProductStatus}</p>
                </div>
                <div>
                    <Image
                        src={config.imageBaseUrl + product.ProductImage}
                        alt={product.ProductName}
                        width={100}
                        height={100}
                        className="w-full h-60 object-cover object-center bg-gray-100"
                    />
                </div>
                <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    onClick={toggleReviewForm}
                >
                    {isReviewFormOpen ? 'סגור ביקורת' : 'להוספת ביקורת'}
                </button>
            </div>

            {isReviewFormOpen && (
                <div className="mt-4 border-t pt-4">
                    <ReviewForm
                        productID={product.ProductID}
                        isOpen={isReviewFormOpen}
                        onClose={() => setIsReviewFormOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}