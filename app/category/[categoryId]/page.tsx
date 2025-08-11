import { Product } from '../../types';
import InfiniteProductList from '../../components/productList/InfiniteProductList';
import { notFound } from 'next/navigation';
import { CategoryProvider } from '../categoryContex';
import { config } from '@/app/config/config';
import CartDrawer from '@/app/components/cart/cart-drawer';

interface CategoryPageProps {
  params: { categoryId: string };
}

const baseUrl = config.apiBaseUrl

async function getProducts(categoryId: string): Promise<Product[]> {
  const res = await fetch(`${baseUrl}/category/${categoryId}/products`, { cache: 'no-store' });
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
      <ul>
      <li>
            <CartDrawer />
          </li>
      </ul>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Product List for Category {categoryId}</h1>
        <InfiniteProductList categoryId={categoryId} initialProducts={products} />
      </main>
    </CategoryProvider>
  );
} 