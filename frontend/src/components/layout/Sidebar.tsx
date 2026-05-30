'use client';

import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

import { Category } from '@/types/category';

import { getCategories } from '@/services/categories-service';

import { useAuthStore } from '@/store/auth-store';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({
  isOpen,
}: SidebarProps) {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const user = useAuthStore(
    (state) => state.user,
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const data =
          await getCategories();

        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadCategories();
  }, []);

  return (
    <>
      {/* overlay mobile */}
      <div
        className={`
          fixed
          inset-0
          z-30
          transition-opacity
          duration-300
          lg:hidden

          ${
            isOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible'
          }
        `}
      />

      <aside
        className={`
          fixed
          left-0
          top-0
          z-40
          flex
          h-screen
          w-64
          flex-col
          border-r
          border-zinc-800
          bg-zinc-800
          text-zinc-200
          shadow-2xl
          transition-transform
          duration-300

          pt-20

          lg:translate-x-0

          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <div
          className="
            flex
            flex-1
            flex-col
            gap-6
            overflow-y-auto
            px-4
            py-4
          "
        >
          {/* categorias */}
          <div className="flex flex-col gap-2">
            <h2
              className="
                px-2
                text-sm
                font-bold
                uppercase
                tracking-wider
                text-zinc-400
              "
            >
              Categorias
            </h2>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  font-medium
                  transition
                  hover:bg-zinc-800
                  hover:text-white
                "
              >
                {category.name}
              </Link>
            ))}
          </div>

          <hr className="border-zinc-400" />

          {/* pedidos */}
          <div className="flex flex-col gap-2">
            <Link
              href="/orders"
              className="
                rounded-xl
                px-3
                py-2
                text-sm
                font-medium
                transition
                hover:bg-zinc-800
                hover:text-white
              "
            >
              Meus Pedidos
            </Link>
          </div>

          {/* admin */}
          {user?.role === 'ADMIN' && (
            <>
              <hr className="border-zinc-400" />

              <div className="flex flex-col gap-2">
                <h2
                  className="
                    px-2
                    text-sm
                    font-bold
                    uppercase
                    tracking-wider
                    text-zinc-400
                  "
                >
                  Admin
                </h2>

                <Link
                  href="/admin/products"
                  className="
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:bg-zinc-800
                    hover:text-white
                  "
                >
                  Produtos
                </Link>

                <Link
                  href="/admin/categories"
                  className="
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:bg-zinc-800
                    hover:text-white
                  "
                >
                  Categorias
                </Link>

                <Link
                  href="/admin/users"
                  className="
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:bg-zinc-800
                    hover:text-white
                  "
                >
                  Usuários
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
