'use client';

import {
  FaShoppingCart,
  FaTrash,
} from 'react-icons/fa';

import { Container } from '@/components/layout/Container';

import { useCart } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

import { createOrder } from '@/services/orders-service';

export default function CartPage() {
  const {
    items: rawItems,
    removeFromCart,
    clearCart,
    isHydrated,
  } = useCart();

  const items =
    isHydrated &&
    Array.isArray(rawItems)
      ? rawItems
      : [];

  const user = useAuthStore(
    (state) => state.user,
  );

  const total = items.reduce(
    (accumulator, item) => {
      const priceWithDiscount =
        item.discount
          ? item.price -
            item.discount
          : item.price;

      const qty =
        Number(item?.quantity) || 0;

      return (
        accumulator +
        priceWithDiscount * qty
      );
    },
    0,
  );

  async function handleCheckout() {
    if (!user) {
      alert('Faça login');
      return;
    }

    try {
      await createOrder({
        userId: user.userId,
        total,

        items: items.map((item) => {
          const priceWithDiscount =
            item.discount
              ? item.price -
                item.discount
              : item.price;

          return {
            productId: item.id,
            quantity:
              item.quantity,
            price:
              priceWithDiscount,
          };
        }),
      });

      clearCart();

      alert(
        'Pedido realizado com sucesso!',
      );
    } catch (error) {
      console.log(error);

      alert(
        'Erro ao finalizar pedido',
      );
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f4f4f5] pt-20">
      <Container>
        <div className="ml-0 flex h-[calc(100vh-80px)] flex-col p-4 md:ml-64 md:p-6">
          {/* TOPO FIXO */}
          <div className="mb-6 flex shrink-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-zinc-900">
                <FaShoppingCart />
                Carrinho
              </h1>

              <div className="mt-3 h-1 w-28 rounded-full bg-zinc-800" />
            </div>
          </div>

          {/* CONTEÚDO */}
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-800">
                  Carrinho vazio
                </h2>

                <p className="mt-2 text-zinc-500">
                  Adicione produtos ao
                  carrinho para continuar.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[1fr_340px]">
              {/* LISTA COM SCROLL */}
              <div className="min-h-0 overflow-y-auto pr-2">
                <div className="flex flex-col gap-5 pb-4">
                  {items.map(
                    (item) => {
                      const priceWithDiscount =
                        item.discount
                          ? item.price -
                            item.discount
                          : item.price;

                      return (
                        <div
                          key={
                            item.id
                          }
                          className="
                            flex flex-col gap-5 rounded-2xl
                            border border-zinc-200
                            bg-white p-5 shadow-sm
                            transition-all duration-200
                            hover:-translate-y-1
                            hover:shadow-md
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >
                          {/* INFO */}
                          <div className="flex gap-4">
                            {item.image && (
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="
                                  h-24 w-24 rounded-2xl
                                  border border-zinc-200
                                  object-cover
                                "
                              />
                            )}

                            <div className="flex flex-col justify-center">
                              <h2 className="text-xl font-bold text-zinc-900">
                                {
                                  item.name
                                }
                              </h2>

                              <p className="mt-2 text-sm text-zinc-500">
                                Quantidade:{' '}
                                <span className="font-semibold text-zinc-800">
                                  {
                                    item.quantity
                                  }
                                </span>
                              </p>

                              {item.discount &&
                              item.discount >
                                0 ? (
                                <div className="mt-3 flex flex-col">
                                  <span className="text-sm text-zinc-400 line-through">
                                    R${' '}
                                    {item.price.toFixed(
                                      2,
                                    )}
                                  </span>

                                  <span className="text-lg font-bold text-green-600">
                                    R${' '}
                                    {priceWithDiscount.toFixed(
                                      2,
                                    )}
                                  </span>
                                </div>
                              ) : (
                                <p className="mt-3 text-lg font-bold text-zinc-900">
                                  R${' '}
                                  {item.price.toFixed(
                                    2,
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* BOTÃO */}
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.id,
                              )
                            }
                            className="
                              flex items-center
                              justify-center gap-2
                              rounded-xl bg-red-600
                              px-5 py-3 text-sm
                              font-medium text-white
                              transition hover:bg-red-700
                              cursor-pointer
                            "
                          >
                            <FaTrash
                              size={14}
                            />
                            Remover
                          </button>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* TOTAL FIXO */}
              <div className="h-fit shrink-0">
                <div
                  className="
                    rounded-2xl border
                    border-zinc-200 bg-white
                    p-6 shadow-sm
                  "
                >
                  <h2 className="text-2xl font-bold text-zinc-900">
                    Resumo
                  </h2>

                  <div className="mt-6 flex items-center justify-between border-b border-zinc-200 pb-4">
                    <span className="text-zinc-500">
                      Total
                    </span>

                    <span className="text-3xl font-bold text-green-600">
                      R${' '}
                      {total.toFixed(
                        2,
                      )}
                    </span>
                  </div>

                  <button
                    onClick={
                      handleCheckout
                    }
                    className="
                      mt-6 w-full rounded-xl
                      bg-zinc-900 px-6 py-4
                      text-sm font-semibold
                      text-white transition
                      hover:bg-zinc-700
                      cursor-pointer
                    "
                  >
                    Finalizar compra
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
