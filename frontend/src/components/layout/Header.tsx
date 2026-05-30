'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FaSearch } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';

import { useCart } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({
  onOpenSidebar,
}: HeaderProps) {
  const {
    items,
    isHydrated,
  } = useCart();

  const itemsList =
    isHydrated &&
    Array.isArray(items)
      ? items
      : [];

  const totalItems =
    itemsList.reduce(
      (
        accumulator,
        item,
      ) => {
        return (
          accumulator +
          (Number(
            item?.quantity,
          ) || 0)
        );
      },
      0,
    );

  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

  const logout =
    useAuthStore(
      (state) =>
        state.logout,
    );

  const router =
    useRouter();

  const [search, setSearch] =
    useState('');

  function handleLogout() {
    localStorage.removeItem(
      'token',
    );

    localStorage.removeItem(
      'auth-storage',
    );

    logout();

    fetch(
      '/api/auth/logout',
      {
        method: 'POST',
      },
    ).catch(() => {});

    router.push('/auth');
  }

  function handleSearch() {
    const trimmedSearch =
      search.trim();

    if (!trimmedSearch) {
      return;
    }

    router.push(
      `/search?query=${trimmedSearch}`,
    );
  }

  return (
    <header
      className="
        fixed
        top-0
        z-50
        flex
        h-16
        w-full
        items-center
        justify-between
        border-b
        border-zinc-800
        bg-zinc-900
        px-4
        text-white
        md:px-6
      "
    >
      {/* esquerda */}
      <div className="flex items-center gap-3">
        <button
          onClick={
            onOpenSidebar
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-xl
            transition
            hover:bg-zinc-800
            lg:hidden
          "
        >
          ☰
        </button>

        <Link
          href="/"
          className="
            text-xl
            font-bold
            tracking-tight
            text-white
          "
        >
          PrimeCart
        </Link>
      </div>

      {/* busca */}
      <div className="mx-4 hidden w-full max-w-xl md:block">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            onKeyDown={(
              event,
            ) => {
              if (
                event.key ===
                'Enter'
              ) {
                handleSearch();
              }
            }}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-zinc-800
              px-4
              text-sm
              text-white
              outline-none
              transition
              placeholder:text-zinc-400
              focus:border-zinc-500
            "
          />

          <button
            onClick={
              handleSearch
            }
            className="
              flex
              h-11
              min-w-[48px]
              items-center
              justify-center
              rounded-xl
              bg-white
              text-zinc-900
              transition
              hover:bg-zinc-200
              cursor-pointer
            "
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* direita */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link
          href="/cart"
          className="
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-zinc-200
            transition
            hover:bg-zinc-800
          "
        >
          <span className="flex items-center gap-1">
            <FaShoppingCart />

            <span>
              ({totalItems})
            </span>
          </span>
        </Link>

        {user && (
          <span
            className="
              hidden
              text-sm
              text-zinc-300
              lg:block
            "
          >
            {user.email}
          </span>
        )}

        <button
          onClick={
            handleLogout
          }
          className="
            rounded-lg
            bg-red-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-red-700
            cursor-pointer
          "
        >
          Sair
        </button>
      </div>
    </header>
  );
}
