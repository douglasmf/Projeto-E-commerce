import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { SearchFilters } from '@/components/search/SearchFilters';
import { getProducts } from '@/services/products-service';

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const {
    query,
    sort,
  } = await searchParams;

  const products =
    await getProducts();

  const normalizedQuery =
    query?.trim().toLowerCase() || '';

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .startsWith(
          normalizedQuery,
        ),
    );

  if (sort === 'price_asc') {
    filteredProducts.sort(
      (a, b) =>
        a.price - b.price,
    );
  }

  if (sort === 'price_desc') {
    filteredProducts.sort(
      (a, b) =>
        b.price - a.price,
    );
  }

  if (sort === 'name') {
    filteredProducts.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
        ),
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f4f4f5] pt-20">
      <Container>
        <div className="ml-0 flex h-[calc(100vh-80px)] flex-col p-4 md:ml-64 md:p-6">
          
          {/* TOPO FIXO */}
          <div className="flex-shrink-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-900">
                Resultados de busca para "
                {query}"
              </h1>

              <div className="mt-3 h-1 w-40 rounded-full bg-zinc-800" />
            </div>

            <div className="mb-8">
              <SearchFilters query={query} />
            </div>
          </div>

          {/* ÁREA COM SCROLL */}
          <div className="flex-1 overflow-y-auto pr-2">
            {filteredProducts.length ===
            0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
                <p className="text-zinc-500">
                  Nenhum produto encontrado.
                </p>
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  pb-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
              >
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}


