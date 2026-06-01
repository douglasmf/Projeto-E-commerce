import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';

import { getProducts } from '@/services/products-service';
import { getCategories } from '@/services/categories-service';

import Link from 'next/link';

export default async function Home() {
   try {
    const products = await getProducts();

    return (
      <div>
        Produtos carregados: {products.length}
      </div>
    );
  } catch (error) {
    console.log(error);

    return (
      <div>
        Erro ao carregar produtos
      </div>
    );
  }


  const categories = await getCategories();

  // categorias exibidas na home
  const featuredCategories = [
    'Eletrônicos',
    'Computadores',
    'Casa',
    'Escritório',
    'Esportes',
  ];

  return (
    <>
      <main className="min-h-screen bg-[#F4F4F5] pt-20">
        <Container>
          <div
            className="
              pb-10

              lg:ml-64
            "
          >
            {categories
              .filter((category) =>
                featuredCategories.includes(category.name),
              )
              .map((category) => {
                const categoryProducts = products.filter(
                  (product) =>
                    product.categoryId === category.id,
                );

                return (
                  <section
                    key={category.id}
                    className="mb-14"
                  >
                    {/* topo da categoria */}
                    <div
                      className="
                        mb-5

                        flex
                        items-center
                        justify-between

                        border-b
                        border-zinc-300

                        pb-3
                      "
                    >
                      <h2
                        className="
                          text-xl
                          font-bold
                          text-zinc-800

                          sm:text-2xl
                        "
                      >
                        {category.name}
                      </h2>

                      <Link
                        href={`/category/${category.id}`}
                        className="
                          text-sm
                          font-semibold
                          text-zinc-700
                          transition
                          hover:text-zinc-950
                        "
                      >
                        Ver mais
                      </Link>
                    </div>

                    {/* produtos */}
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
                  </section>
                );
              })}
          </div>
        </Container>
      </main>
    </>
  );
}
