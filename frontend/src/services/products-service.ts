import type { Product } from '@/types/product';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CreateProductData {
  name: string;

  price: number;

  discount?: number;

  stock: number;

  image?: string;

  categoryId?: number;
}

interface UpdateProductData {
  name?: string;

  price?: number;

  discount?: number;

  stock?: number;

  image?: string;

  categoryId?: number;
}

interface GetProductsFilters {
  name?: string;
  categoryId?: number;
}

export async function getProducts(filters?: GetProductsFilters): Promise<Product[]> {
  const params = new URLSearchParams();

  if (filters?.name) params.set('name', String(filters.name));
  if (filters?.categoryId)
    params.set('categoryId', String(filters.categoryId));

  const url = `${BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  return res.json();
}

export async function createProduct(
  data: CreateProductData,
) {
  const { api } = await import('./api');

  const response = await api.post('/products', data);

  return response.data;
}

export async function updateProduct(
  id: number,
  data: UpdateProductData,
) {
  const { api } = await import('./api');

  const response = await api.patch(`/products/${id}`, data);

  return response.data;
}

export async function deleteProduct(
  id: number,
) {
  const { api } = await import('./api');

  const response = await api.delete(`/products/${id}`);

  return response.data;
}
