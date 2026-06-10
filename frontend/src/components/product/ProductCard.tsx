'use client';

import { useState } from 'react';

import { Product } from '@/types/product';

import { useCart } from '@/store/cart-store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    try {
      setIsAdding(true);

      addToCart(product, quantity);

      alert(`${product.name} adicionado ao carrinho!`);

      setQuantity(1);
    } catch (error) {
      console.error('Erro ao adicionar:', error);

      alert('Erro ao adicionar ao carrinho');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="
        flex
        h-full
        flex-col
        rounded-2xl
        border
        border-zinc-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200

        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <div
        className="
          mb-4
          flex
          h-44
          items-center
          justify-center
          overflow-hidden
          rounded-xl
        "
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="
              h-full
              w-full
              object-contain
            "
          />
        ) : (
          <span className="text-zinc-400">
            Imagem
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h3
          className="
            mb-3
            line-clamp-2
            text-base
            font-semibold
            text-zinc-800

            sm:text-lg
          "
        >
          {product.name}
        </h3>

        <div className="mb-4">
          {product.discount &&
          product.discount > 0 ? (
            <div className="flex flex-col">
              <span
                className="
                  text-sm
                  text-zinc-400
                  line-through
                "
              >
                R$
                {' '}
                {product.price.toFixed(2)}
              </span>

              <span
                className="
                  text-2xl
                  font-bold
                  text-green-600
                "
              >
                R$
                {' '}
                {(
                  product.price -
                  product.discount
                ).toFixed(2)}
              </span>
            </div>
          ) : (
            <span
              className="
                text-2xl
                font-bold
                text-zinc-900
              "
            >
              R$
              {' '}
              {product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div
          className="
            mt-auto
            flex
            items-center
            gap-2
          "
        >
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Number(event.target.value),
              )
            }
            className="
              h-11
              w-20
              rounded-lg
              border
              border-zinc-300
              bg-white
              px-2
              text-center
              text-sm
              outline-none
              transition

              focus:border-zinc-500
            "
          />

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="
              h-11
              flex-1
              rounded-lg
              bg-zinc-900
              px-4
              text-sm
              font-semibold
              text-white
              transition
              duration-200
              cursor-pointer

              hover:bg-zinc-800

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isAdding
              ? 'Adicionando...'
              : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
