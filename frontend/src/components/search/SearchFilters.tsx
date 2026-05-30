'use client';

import { useRouter } from 'next/navigation';

interface SearchFiltersProps {
  query?: string;
}

export function SearchFilters({
  query,
}: SearchFiltersProps) {
  const router = useRouter();

  function handleSort(
    value: string,
  ) {
    router.push(
      `/search?query=${query}&sort=${value}`,
    );
  }

  return (
    <div className="mb-6 flex gap-4">
      <select
        onChange={(event) =>
          handleSort(
            event.target.value,
          )
        }
        className="rounded-md border border-zinc-300 p-2 bg-white"
      >
        <option value="">
          Ordenar
        </option>

        <option value="price_asc">
          Menor preço
        </option>

        <option value="price_desc">
          Maior preço
        </option>

        <option value="name">
          Nome A-Z
        </option>
      </select>
    </div>
  );
}