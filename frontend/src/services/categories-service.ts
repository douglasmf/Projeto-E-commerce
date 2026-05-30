import { api } from './api';

export interface Category {
  id: number;

  name: string;
}

interface CreateCategoryData {
  name: string;
}

interface UpdateCategoryData {
  name: string;
}

export async function getCategories(): Promise<
  Category[]
> {
  const response = await api.get('/categories');

  return response.data;
}

export async function createCategory(
  data: CreateCategoryData,
) {
  const response = await api.post(
    '/categories',
    data,
  );

  return response.data;
}

export async function updateCategory(
  id: number,
  data: UpdateCategoryData,
) {
  const response = await api.patch(
    `/categories/${id}`,
    data,
  );

  return response.data;
}

export async function deleteCategory(
  id: number,
) {
  const response = await api.delete(
    `/categories/${id}`,
  );

  return response.data;
}
