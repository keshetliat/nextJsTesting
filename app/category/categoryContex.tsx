'use client';
import { createContext, useContext, useState } from 'react';
import { Product } from '../types';

type CategoryContextType = {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <CategoryContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
