import { api } from './api';

export interface User {
  id: number;

  name: string;

  email: string;

  role: string;

  orders?: {
    id: number;

    total: number;

    createdAt: string;
  }[];
}

export async function getUsers(): Promise<
  User[]
> {
  const response =
    await api.get('/users');

  return response.data;
}

export async function getUserById(
  id: number,
): Promise<User> {
  const response =
    await api.get(
      `/users/${id}`,
    );

  return response.data;
}

export async function deleteUser(
  id: number,
) {
  const response =
    await api.delete(
      `/users/delete/${id}`,
    );

  return response.data;
}
