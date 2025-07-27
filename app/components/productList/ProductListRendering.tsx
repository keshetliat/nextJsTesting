'use client';
import React from 'react';
import { Product } from '../../types';
import ProductListItem from './ProductListItem';
import '../../styles/ProductListRendering.scss';
import ProductListPopup from '../../popups/ProductListPopup';
import { useDispatch, useSelector } from 'react-redux';
import { openPopup, closePopup } from '../../../redux/slices/productListSlice';
import { RootState } from '../../../redux/store';
import { useCategory } from '../../category/categoryContex';

interface ProductListRenderingProps {
  products: Product[];
}

export default function ProductListRendering({ products }: ProductListRenderingProps) {
  const dispatch = useDispatch();
  const { selectedProduct, setSelectedProduct } = useCategory();

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
      {selectedProduct && (
        <ProductListPopup
          selectedProduct={selectedProduct}
          onClose={() => dispatch(closePopup())}
        />
      )}
    </>
  );
} 