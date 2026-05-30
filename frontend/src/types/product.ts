export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  discount?: number;
  image?: string;
  categoryId?: number;
  createdAt?: string;
}