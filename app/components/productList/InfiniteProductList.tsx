'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../../types';
import ProductListItem from './ProductListItem';
import '../../styles/ProductListRendering.scss';
import ProductListPopup from '../../popups/ProductListPopup';
import { useDispatch, useSelector } from 'react-redux';
import { openPopup, closePopup } from '../../../redux/slices/productListSlice';
import { config } from '@/app/config/config';
import { RootState } from '../../../redux/store';

interface InfiniteProductListProps {
  categoryId: string;
  initialProducts: Product[];
}

const baseUrl = config.apiBaseUrl

export default function InfiniteProductList({ categoryId, initialProducts }: InfiniteProductListProps) {
  const dispatch = useDispatch();
  
  // Use Redux state for popup rendering since click handlers dispatch Redux actions
  const reduxSelectedProduct = useSelector((state: RootState) => state.popup.selectedProduct);
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(30);
  const [take] = useState(30);
  
  //useRef שומר ערך שנשמר בין רינדורים מבלי לגרום לרינדור מחדש.
  //observer — מחזיק את אובייקט ה־IntersectionObserver כדי לעקוב אחרי האלמנט בסוף הרשימה.
  //loadingRef — רפרנס ל־<div> שמסמן את נקודת הסיום של הרשימה.
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // With useCallback - function only recreated when dependencies change
  //useCallback מחזיר פונקציה ממורכזת (memoized) — נבנית מחדש רק אם אחד מהתלויות משתנה.
  //אם לא היינו משתמשים ב־useCallback, הפונקציה הייתה נוצרת מחדש בכל רינדור, 
  // מה שהיה מפעיל שוב את ה־useEffect שלא לצורך.
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/category/${categoryId}/products?take=${take}&skip=${skip}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) {
        setHasMore(false);
        return;
      }
      
      const data = await response.json();
      const newProducts = data.Items || [];
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setSkip(prev => prev + take);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [categoryId, loading, hasMore, skip, take]);

  useEffect(() => {
    const currentObserver = observer.current;
    const currentLoadingRef = loadingRef.current;
    
    //כשהמשתמש גולל כך שה־<div> הזה נכנס למסך (לפחות 10% ממנו, בגלל threshold: 0.1), 
    // הפונקציה loadMoreProducts מופעלת ומביאה עוד מוצרים.
    if (currentLoadingRef) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMoreProducts();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.current.observe(currentLoadingRef);
    }
    
    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [loadMoreProducts, hasMore, loading]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductListItem
            key={product.ProductID}
            product={product}
            onClick={() => dispatch(openPopup(product))}
          />
        ))}
      </div>
      
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-4">
          {loading ? (
            <div className="text-gray-600">Loading more products...</div>
          ) : (
            <div className="text-gray-400">Scroll to load more</div>
          )}
        </div>
      )}
      
      {reduxSelectedProduct && (
        <ProductListPopup
          selectedProduct={reduxSelectedProduct}
          onClose={() => dispatch(closePopup())}
        />
      )}
    </>
  );
} 