import { Product } from '../../types';
import ProductListRendering from '../../components/productList/ProductListRendering';
import { notFound } from 'next/navigation';
import { CategoryProvider } from '../categoryContex';

interface CategoryPageProps {
  params: { categoryId: string };
}

async function getProducts(categoryId: string): Promise<Product[]> {
  const res = await fetch(`https://evritapiqa.e-vrit.co.il/category/${categoryId}/products?`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.Items || [];
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = params;
  const products = await getProducts(categoryId);

  if (!products.length) {
    return <div>No products found for category {categoryId}.</div>;
  }

  return (
    <CategoryProvider>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Product List for Category {categoryId}</h1>
        <ProductListRendering products={products} />
      </main>
    </CategoryProvider>
  );
} 