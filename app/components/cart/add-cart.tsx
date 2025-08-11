'use client'

import { useCartStore } from "@/lib/client-store"
import { useState } from "react"
import { Button } from "../ui/ui/button"
import { Minus, Plus } from "lucide-react"
import { Product } from "@/app/types"

export default function AddCart({product}: {product: Product}) {
    const {addToCart, cart} = useCartStore()
    const [quantity, setQuantity] = useState(1)
    
    // Get current quantity of this product in cart
    const currentCartQuantity = cart.find(item => item.variant.variantID === product.ProductID)?.variant.quantity || 0

    return(
        <>
        <div className="flex items-center gap-4 justify-stretch my-4">
            <Button onClick={() => {
                if(quantity > 1) {
                    setQuantity(quantity - 1)
                }
              }}  
              variant={"secondary"} className="text-primary">
                <Minus size={18} strokeWidth={3}/>
            </Button>
            <Button variant="secondary" className="text-primary">
                כמות: {quantity}
            </Button>
            <Button onClick={() =>{
                setQuantity(quantity + 1)
            }}
            variant="secondary" className="text-primary">
                <Plus size={18} strokeWidth={3}/>
            </Button>
        </div>
        
        {/* Show current cart quantity */}
        <div className="text-sm text-gray-600 mb-2">
            בסל: {currentCartQuantity} פריטים
        </div>
        <Button onClick={()=>{
            addToCart({
                id: product.ProductID,
                name: product.ProductName,
                image: product.Image,
                variant: {
                    variantID: product.ProductID,
                    quantity: 1
                },
                price: product.ProductPrices.DigitalBargainPrice || 0
            })
        }}>
            הוסף לסל
        </Button>
        </>
    )
}