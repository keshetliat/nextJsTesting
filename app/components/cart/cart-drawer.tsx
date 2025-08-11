'use client'
import { useCartStore } from '@/lib/client-store'
import { ShoppingBag } from 'lucide-react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/ui/drawer'
import { AnimatePresence, motion } from 'framer-motion'

export default function CartDrawer() {
    const { cart } = useCartStore()
    
    return (
        <div>
            <Drawer>
                <DrawerTrigger>
                    <div className="relative px-2">
                        <AnimatePresence>
                            {cart.length > 0 && (
                                <motion.span 
                                    animate={{scale: 1, opacity: 1}}
                                    initial={{scale: 0, opacity: 0}} 
                                    exit={{scale: 0}} 
                                    className="absolute flex items-center justify-center -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 z-10"
                                >
                                    {cart.length}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Cart ({cart.length} items)</DrawerTitle>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        </div>
    )
}