'use client';
import { useState } from "react";

export default function ProductCard() {
  const [product, setProduct] = useState({
    name: "Product 1",
    price: 100,
    image: "https://via.placeholder.com/150",
  });
  const addToCart = (product: any) => {
    console.log(product);
  };
  return (
    <div>
      <button onClick={() => addToCart(product)}>add to cart</button>
    </div>
  );
}

