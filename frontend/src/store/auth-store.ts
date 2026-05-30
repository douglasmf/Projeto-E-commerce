import { create } from 'zustand';

import { persist } from 'zustand/middleware';
import { useCartStore } from '@/store/cart-store';

interface User {
  userId: number;

  email: string;

  role: 'ADMIN' | 'USER';
}

interface AuthStore {
  token: string | null;

  user: User | null;

  isLoading: boolean;

  setAuth: (
    token: string,
    user: User,
  ) => void;

  logout: () => void;

  setLoading: (loading: boolean) => void;
}

export const useAuthStore =
  create<AuthStore>()(
    persist(
      (set) => ({
        token: null,

        user: null,

        isLoading: true,

        setAuth: (token, user) => {
          set({
            token,
            user,
            isLoading: false,
          });

          try {
            useCartStore.getState().loadUserCart();
          } catch (e) {
            // ignore
          }
        },

        logout: () => {
          set({
            token: null,
            user: null,
          });

          try {
            useCartStore.getState().clearCart();
          } catch (e) {
            // ignore
          }
        },

        setLoading: (loading) =>
          set({
            isLoading: loading,
          }),
      }),
      {
        name: 'auth-storage',
      },
    ),
  );