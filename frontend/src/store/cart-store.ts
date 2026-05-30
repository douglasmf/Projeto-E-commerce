import { create } from 'zustand';

import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';

import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addToCart: (
    product: Product,
    quantity: number,
  ) => void;

  removeFromCart: (
    productId: number,
  ) => void;

  clearCart: () => void;

  loadUserCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity) => {
        const rawItems = get().items;
        const items = Array.isArray(rawItems) ? rawItems : [];

        const existingProduct = items.find((item) => item.id === product.id);

        const qty = Number(quantity) || 0;

        if (existingProduct) {
          const updatedItems = items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (Number(item.quantity) || 0) + qty }
              : item,
          );

          set({ items: updatedItems });

          return;
        }

        set({ items: [...items, { ...product, quantity: qty }] });
      },

      removeFromCart: (productId) => {
        const rawItems = get().items;
        const items = Array.isArray(rawItems) ? rawItems : [];

        const updatedItems = items.filter((item) => item.id !== productId);

        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      loadUserCart: () => {
        // Força rehidratação quando o userId muda
        useCartStore.persist.rehydrate();
      },
    }),
    {
      name: 'cart-storage',
      // provide custom storage that prefixes the key with the current user id
      storage:createJSONStorage(() => ({
        getItem: (name: string) => {
          try {
            let id = 'guest';

            if (typeof window !== 'undefined') {
              const authRaw = localStorage.getItem('auth-storage');

              if (authRaw) {
                try {
                  const authParsed = JSON.parse(authRaw);
                  id = authParsed?.user?.userId ?? 'guest';
                } catch (e) {
                  // ignore
                }
              }
            }

            return localStorage.getItem(`${name}-${id}`);
          } catch (e) {
            return null;
          }
        },
        setItem: (name: string, value: string) => {
          try {
            let id = 'guest';

            if (typeof window !== 'undefined') {
              const authRaw = localStorage.getItem('auth-storage');

              if (authRaw) {
                try {
                  const authParsed = JSON.parse(authRaw);
                  id = authParsed?.user?.userId ?? 'guest';
                } catch (e) {
                  // ignore
                }
              }
            }

            localStorage.setItem(`${name}-${id}`, value);
          } catch (e) {
            // ignore
          }
        },
        removeItem: (name: string) => {
          try {
            let id = 'guest';

            if (typeof window !== 'undefined') {
              const authRaw = localStorage.getItem('auth-storage');

              if (authRaw) {
                try {
                  const authParsed = JSON.parse(authRaw);
                  id = authParsed?.user?.userId ?? 'guest';
                } catch (e) {
                  
                }
              }
            }

            localStorage.removeItem(`${name}-${id}`);
          } catch (e) {
            
          }
        },
      })),
    },
  ),
);

// Hook customizado que garante hidratação antes de acessar o store
export function useCart() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // Força rehydrate do Zustand
    useCartStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  const cart = useCartStore();

  return {
    ...cart,
    isHydrated,
  };
}