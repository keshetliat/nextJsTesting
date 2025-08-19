"use client"

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HEADER_LINKS } from '@/app/config/navigation';

export default function Header() {
    const pathname = usePathname();
    const [animationKey, setAnimationKey] = useState(0);
    
    // Force re-animation when pathname changes
    useEffect(() => {
        setAnimationKey(prev => prev + 1);
    }, [pathname]);

    const handleLinkClick = () => {
        // Force animation even when clicking the same link
        setAnimationKey(prev => prev + 1);
    };

    return (
        <div>
           <nav className="py-2 overflow-auto">
            <ul className="flex gap-6 text-sm font-bold text-secondary">
                {
                   HEADER_LINKS.slice().reverse().map((link: any) => (
                    <motion.li whileTap={{scale: 0.95}} key={link.id}>
                        <Link 
                            className={cn(
                                "flex gap-1 flex-col items-center relative", 
                                pathname === link.path && "!text-primary"
                            )}
                            style={{
                                color: pathname === link.path ? '#3b82f6' : '#10abd9'
                            }}
                            href={link.path}
                            onClick={handleLinkClick}
                        >
                            {link.icon()}
                            {link.label}
                            <AnimatePresence mode="wait">
                                {pathname === link.path && (
                                    <motion.div 
                                        key={`${link.id}-${animationKey}`} // Unique key for each link + animation trigger
                                        initial={{ scale: 0.8 }}
                                        className="h-[3px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                        </Link>
                    </motion.li>
                   ))
                }
            </ul>
           </nav>
        </div>
    )
}