'use client';
import React from 'react';
import { Product } from '../types';
import '../styles/ProductListRendering.scss';

interface ProductListPopupProps {
  selectedProduct: Product;
  onClose: () => void;
}

export default function ProductListPopup({ selectedProduct, onClose }: ProductListPopupProps) {
  if (!selectedProduct) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-lg w-full relative overflow-y-auto overflow-hidden custom-scrollbar"
        style={{ maxHeight: '80vh' }}
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2">{selectedProduct.ProductName}</h2>
        <img
          src={`https://qa-images-evrit.yit.co.il/${selectedProduct.Image}`}
          alt={selectedProduct.ProductName}
          className="w-full h-64 object-cover object-center mb-4 bg-gray-100 rounded"
        />
        <div className="mb-2 text-sm text-gray-600">
          <strong>סופרים:</strong> {selectedProduct.Authors?.map(a => a.AuthorName).join(', ')}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <strong>שנת הוצאה:</strong> {selectedProduct.PublishYear}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <strong>קטגוריות:</strong> {selectedProduct.Categories?.map(c => c.CategoryName).join(', ')}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <strong>מפרסם:</strong> {selectedProduct.Publishers?.map(p => p.PublisherName).join(', ')}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <strong>כמות דפים:</strong> {selectedProduct.NumOfPages}
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <strong>תיאור:</strong>
          <div
            className="mt-1"
            dangerouslySetInnerHTML={{ __html: selectedProduct.Description }}
          />
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <strong>מחירים:</strong>
          <ul className="ml-4">
            {selectedProduct.ProductPrices?.RetailPrice && (
              <li>מודפס: ₪{selectedProduct.ProductPrices.RetailPrice.toFixed(2)}</li>
            )}
            {selectedProduct.ProductPrices?.DigitalOriginalPrice && (
              <li>דיגיטלי: ₪{selectedProduct.ProductPrices.DigitalOriginalPrice.toFixed(2)}</li>
            )}
            {/* Add more price types as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
} 