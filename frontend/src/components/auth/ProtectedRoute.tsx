'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;

  adminOnly?: boolean;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading,
  );

  useEffect(() => {
    // ainda está carregando o usuário
    if (isLoading) {
      return;
    }

    // não logado
    if (!user) {
      router.push('/auth');

      return;
    }

    // não é admin
    if (
      adminOnly &&
      user.role !== 'ADMIN'
    ) {
      router.push('/');
    }
  }, [user, adminOnly, router, isLoading]);

  // aguarda carregamento
  if (isLoading) {
    return null;
  }

  // evita piscar conteúdo
  if (!user) {
    return null;
  }

  if (
    adminOnly &&
    user.role !== 'ADMIN'
  ) {
    return null;
  }

  return <>{children}</>;
}