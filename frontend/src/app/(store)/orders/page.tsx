'use client';

import { useEffect, useState } from 'react';

import { Container } from '@/components/layout/Container';
import { api } from '@/services/api';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<
    Order[]
  >([]);

  async function loadOrders() {
    try {
      const response = await api.get(
        '/orders',
      );

      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-[#f4f4f5] pt-20">
      <Container>
        <div
          className="
            ml-0
            flex
            h-[calc(100vh-80px)]
            flex-col
            p-4
            md:ml-64
            md:p-6
          "
        >
          {/* TOPO FIXO */}
          <div className="mb-8 flex-shrink-0">
            <h1 className="text-3xl font-bold text-zinc-900">
              Histórico de Pedidos
            </h1>

            <div className="mt-3 h-1 w-40 rounded-full bg-zinc-800" />
          </div>

          {/* CONTEÚDO COM SCROLL */}
          <div className="flex-1 overflow-y-auto pr-2">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-zinc-500">
                  Nenhum pedido encontrado.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 pb-4 xl:grid-cols-2">
                {orders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="
                        rounded-2xl
                        border
                        border-zinc-200
                        bg-white
                        p-6
                        shadow-sm
                        transition-all
                        duration-200
                        hover:-translate-y-1
                        hover:shadow-md
                      "
                    >
                      {/* HEADER */}
                      <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-zinc-900">
                            Pedido #{order.id}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-500">
                            {new Date(
                              order.createdAt,
                            ).toLocaleDateString(
                              'pt-BR',
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-green-100 px-4 py-3 text-center">
                          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                            Total
                          </p>

                          <h3 className="text-2xl font-bold text-green-700">
                            R$ {order.total.toFixed(2)}
                          </h3>
                        </div>
                      </div>

                      {/* ITENS */}
                      <div className="flex flex-col gap-3">
                        {order.items.map(
                          (item) => (
                            <div
                              key={item.id}
                              className="
                                flex
                                flex-col
                                gap-2
                                rounded-xl
                                border
                                border-zinc-200
                                bg-zinc-50
                                p-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                              "
                            >
                              <div>
                                <h3 className="font-semibold text-zinc-900">
                                  {
                                    item.product
                                      .name
                                  }
                                </h3>

                                <p className="mt-1 text-sm text-zinc-500">
                                  Quantidade:{' '}
                                  <span className="font-medium text-zinc-700">
                                    {
                                      item.quantity
                                    }
                                  </span>
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                  Valor unitário
                                </p>

                                <p className="mt-1 text-lg font-bold text-zinc-900">
                                  R$ {item.price}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

