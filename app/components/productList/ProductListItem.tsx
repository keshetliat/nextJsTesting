'use client';
import React from 'react';
import { Product, Author, Category } from '../../types';
import Image from 'next/image';

interface ProductListItemProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductListItem({ product, onClick }: ProductListItemProps) {
    const baseUrl="https://qa-images-evrit.yit.co.il/"
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer" onClick={onClick}>
      <Image
        src={baseUrl+product.Image}
        alt={product.ProductName}
        width={400}
        height={400}
        className="w-full h-60 object-cover object-center bg-gray-100"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-1 truncate" title={product.ProductName}>
          {product.ProductName}
        </h3>
        <div className="text-sm text-gray-600 mb-1">
          {product.Authors?.map((a: Author) => a.AuthorName).join(', ')}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {product.PublishYear} | {product.Categories?.map((c: Category) => c.CategoryName).join(', ')}
        </div>
        <div className="mb-2">
          {product.ProductPrices?.RetailPrice && (
            <div className="ml-2 text-xs text-gray-500">
              מודפס: ₪{product.ProductPrices.RetailPrice.toFixed(2)}
            </div>
          )}
          {product.ProductPrices?.DigitalOriginalPrice && (
            <div className="ml-2 text-xs text-green-600">
              דיגיטלי: ₪{product.ProductPrices.DigitalOriginalPrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 