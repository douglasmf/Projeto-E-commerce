'use client';

import { ReactNode, useEffect } from 'react';

import { api } from '@/services/api';

import { useAuthStore } from '@/store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data;

        const user = {
          userId: profile.userId,
          email: profile.email,
          role: profile.role,
        };

        setAuth(token, user);
      } catch (error) {
        console.log(error);

        localStorage.removeItem('token');
        setLoading(false);
      }
    }

    loadUser();
  }, [setAuth, setLoading]);

  return children;
}