'use client';

import { api } from './api';

interface CreateOrderData {
  userId: number;

  total: number;

  items: {
    productId: number;

    quantity: number;

    price: number;
  }[];
}

export async function createOrder(
  data: CreateOrderData,
) {
  const response = await api.post(
    '/orders',
    data,
  );

  return response.data;
}