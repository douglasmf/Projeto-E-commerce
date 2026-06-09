'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useParams } from 'next/navigation';

import { Container } from '@/components/layout/Container';

import { ProductCard } from '@/components/product/ProductCard';

import { getProducts } from '@/services/products-service';

import { getCategories } from '@/services/categories-service';

import type { Product } from '@/types/product';

import type { Category } from '@/types/category';

export default function CategoryPage() {
  const params = useParams();

  const id = params.id as string;

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [
          productsData,
          categoriesData,
        ] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsData);

        setCategories(categoriesData);
      } catch (error) {
        console.error(
          'Erro ao carregar dados:',
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const categoryId = Number(id);

  const category = categories.find(
    (category) =>
      category.id === categoryId,
  );

  const categoryProducts = products.filter(
    (product) =>
      product.categoryId === categoryId,
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4F4F5] pt-20">
        <Container>
          <div className="pb-10 lg:ml-64">
            <p className="text-zinc-600">
              Carregando...
            </p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <>
      <main className="h-screen bg-[#F4F4F5] pt-20 overflow-hidden">
        <Container>
          <div
            className="
              h-[calc(100vh-5rem)]
              lg:ml-64
              flex
              flex-col
            "
          >
            {/* topo */}
            <div
              className="
                sticky
                top-0
                z-10
                bg-[#F4F4F5]
                mb-8
                border-b
                border-zinc-300
                pb-4
                shrink-0
              "
            >
              <h1
                className="
                  text-2xl
                  font-bold
                  text-zinc-800
                  sm:text-3xl
                "
              >
                {category?.name}
              </h1>
            </div>

            {/* conteúdo com scroll */}
            <div
              className="
              flex-1
              overflow-y-auto
              pb-10
            "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                  2xl:grid-cols-5
                "
              >
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
