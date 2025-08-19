'use client';

import { getCustomerProducts} from "@/app/data/services/customer-service";
import { useEffect, useState } from "react";
import CustomerProductItem from "./CustomerProductItem"

export default function CustomerProducts() {

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getCustomerProducts();
                setProducts(products.Items || []); 
            } catch (err) {
                console.error("Failed to fetch products", err);
                setProducts([]);
            } finally {
                setLoading(false); 
            }
        }
        fetchProducts();
    }, []);

    return (
        <div>
        {loading ? (
            <div>Loading products...</div>
        ) : products.length > 0 ? (
            products.map((product) => (
                <CustomerProductItem key={`${product.ProductID}-${product.ItemSourceType}`} product={product} />
            ))
        ) : (
            <div>No products found</div> 
        )}
    </div>
    )
}