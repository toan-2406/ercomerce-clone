"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { cartService } from '@/lib/api/cart-service';
import { useAuth } from './auth-context';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalPrice: number;
    totalItems: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // 1. Initial Load from LocalStorage (Guest)
    useEffect(() => {
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    setItems(parsedCart);
                }
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // 2. Sync with Backend when logged in
    useEffect(() => {
        const syncCart = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response: any = await cartService.getCart();

                    // Backend TransformInterceptor flattens the Cart object to its 'items' array.
                    const backendItems = Array.isArray(response) ? response : (response?.items || []);

                    const formattedItems = backendItems.map((item: any) => ({
                        id: item.productId?._id || item.productId,
                        name: item.productId?.name || 'Sản phẩm',
                        price: item.productId?.price || 0,
                        image: item.productId?.images?.[0] || '',
                        quantity: item.quantity
                    }));

                    setItems(formattedItems);
                } catch (error) {
                    console.error("Failed to sync cart with backend", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        syncCart();
    }, [user]);

    // 3. Persist to LocalStorage (for guests)
    useEffect(() => {
        if (!user) {
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
        }
    }, [items, user]);

    const addToCart = async (newItem: CartItem) => {
        if (user) {
            try {
                await cartService.addToCart(newItem.id, newItem.quantity);
                // Refresh from backend to be safe
                const response: any = await cartService.getCart();
                const backendItems = Array.isArray(response) ? response : (response?.items || []);

                const formattedItems = backendItems.map((item: any) => ({
                    id: item.productId?._id || item.productId,
                    name: item.productId?.name || 'Sản phẩm',
                    price: item.productId?.price || 0,
                    image: item.productId?.images?.[0] || '',
                    quantity: item.quantity
                }));
                setItems(formattedItems);
            } catch (e) {
                console.error("Add to cart failed", e);
            }
        } else {
            setItems(prev => {
                const existing = prev.find(item => item.id === newItem.id);
                if (existing) {
                    return prev.map(item =>
                        item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
                    );
                }
                return [...prev, newItem];
            });
        }
    };

    const removeFromCart = async (id: string) => {
        if (user) {
            try {
                await cartService.removeItem(id);
                setItems(prev => prev.filter(item => item.id !== id));
            } catch (e) { console.error(e); }
        } else {
            setItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return;
        if (user) {
            try {
                await cartService.updateQuantity(id, quantity);
                setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
            } catch (e) { console.error(e); }
        } else {
            setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
        }
    };

    const clearCart = async () => {
        if (user) {
            try {
                await cartService.clearCart();
            } catch (e) { console.error(e); }
        }
        setItems([]);
    };

    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
