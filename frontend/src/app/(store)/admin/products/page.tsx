'use client';

import { useEffect, useMemo, useState } from 'react';

import { FaEdit, FaTrash } from 'react-icons/fa';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Container } from '@/components/layout/Container';

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/products-service';

import { api } from '@/services/api';

interface Category {
  id: number;
  name: string;
}

interface Product {
  image?: string;
  id: number;
  name: string;
  price: number;
  discount?: number;
  stock: number;
  categoryId?: number;
  category?: Category;
}

interface FormData {
  name: string;
  price: string;
  discount: string;
  stock: string;
  categoryId: string;
  image: string;
}

const initialForm: FormData = {
  name: '',
  price: '',
  discount: '',
  stock: '',
  categoryId: '',
  image: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [search, setSearch] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [loading, setLoading] =
    useState(true);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [formData, setFormData] =
    useState<FormData>(initialForm);

  async function loadProducts() {
    try {
      setLoading(true);

      const data =
        await getProducts();

      const orderedProducts =
        data.sort((a, b) =>
          a.name.localeCompare(
            b.name,
          ),
        );

      setProducts(
        orderedProducts,
      );
    } catch (error) {
      console.log(error);

      setErrorMessage(
        'Erro ao carregar produtos.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await api.get(
        '/categories',
      );

      setCategories(
        response.data,
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  function clearMessages() {
    setSuccessMessage('');
    setErrorMessage('');
  }

  function resetForm() {
    setFormData(initialForm);
  }

  function validateForm() {
    if (!formData.name.trim()) {
      setErrorMessage(
        'Informe o nome do produto.',
      );

      return false;
    }

    if (!formData.price) {
      setErrorMessage(
        'Informe o preço.',
      );

      return false;
    }

    if (!formData.stock) {
      setErrorMessage(
        'Informe o estoque.',
      );

      return false;
    }

    if (!formData.categoryId) {
      setErrorMessage(
        'Selecione uma categoria.',
      );

      return false;
    }

    return true;
  }

  function openCreateModal() {
    clearMessages();

    resetForm();

    setCreateModalOpen(true);
  }

  function openEditModal(
    product: Product,
  ) {
    clearMessages();

    setSelectedProduct(product);

    setFormData({
      name: product.name,
      price: String(product.price),
      discount: String(
        product.discount || 0,
      ),
      stock: String(
        product.stock,
      ),
      categoryId: String(
        product.categoryId,
      ),
      image: product.image || '',
    });

    setEditModalOpen(true);
  }

  function openDeleteModal(
    product: Product,
  ) {
    clearMessages();

    setSelectedProduct(product);

    setDeleteModalOpen(true);
  }

  async function handleCreateProduct() {
    try {
      clearMessages();

      const isValid =
        validateForm();

      if (!isValid) {
        return;
      }

      await createProduct({
        name: formData.name,
        price: Number(
          formData.price,
        ),
        discount:
          Number(
            formData.discount,
          ) || 0,
        stock: Number(
          formData.stock,
        ),
        categoryId: Number(
          formData.categoryId,
        ),
        image:
          formData.image || undefined,
      });

      setSuccessMessage(
        'Produto criado com sucesso.',
      );

      setCreateModalOpen(false);

      resetForm();

      loadProducts();
    } catch (error) {
      console.log(error);

      setErrorMessage(
        'Erro ao criar produto.',
      );
    }
  }

  async function handleEditProduct() {
    try {
      clearMessages();

      if (!selectedProduct) {
        return;
      }

      const isValid =
        validateForm();

      if (!isValid) {
        return;
      }

      await updateProduct(
        selectedProduct.id,
        {
          name: formData.name,
          price: Number(
            formData.price,
          ),
          discount:
            Number(
              formData.discount,
            ) || 0,
          stock: Number(
            formData.stock,
          ),
          categoryId: Number(
            formData.categoryId,
          ),
          image:
            formData.image || undefined,
        },
      );

      setSuccessMessage(
        'Produto atualizado com sucesso.',
      );

      setEditModalOpen(false);

      loadProducts();
    } catch (error) {
      console.log(error);

      setErrorMessage(
        'Erro ao atualizar produto.',
      );
    }
  }

  async function handleDeleteProduct() {
    try {
      clearMessages();

      if (!selectedProduct) {
        return;
      }

      await deleteProduct(
        selectedProduct.id,
      );

      setSuccessMessage(
        'Produto deletado com sucesso.',
      );

      setDeleteModalOpen(false);

      loadProducts();
    } catch (error) {
      console.log(error);

      setErrorMessage(
        'Erro ao deletar produto.',
      );
    }
  }

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (product) => {
          const matchSearch =
            product.name
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              );

          const matchCategory =
            selectedCategory ===
            'all' ||
            product.categoryId ===
            Number(
              selectedCategory,
            );

          return (
            matchSearch &&
            matchCategory
          );
        },
      );
    }, [
      products,
      search,
      selectedCategory,
    ]);

  return (
    <ProtectedRoute adminOnly>
      <main className="h-screen bg-[#f4f4f5] pt-20 overflow-hidden">
        <Container>
          <div className="flex h-[calc(100vh-5rem)] flex-col lg:ml-64">

            <div className="flex-shrink-0">
              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">
                    Produtos
                  </h1>
                  <div className="mt-3 h-1 w-28 rounded-full bg-zinc-800" />
                </div>

                <button
                  onClick={openCreateModal}
                  className="cursor-pointer rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700"
                >
                  Novo Produto
                </button>
              </div>

              {successMessage && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-100 p-4 text-sm font-medium text-green-700">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-100 p-4 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row">
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value,
                    )
                  }
                  className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500 md:w-64"
                >
                  <option value="all">
                    Todas
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {loading ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500 shadow-sm">
                  Carregando...
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map(
                    (product) => (
                      <div
                        key={product.id}
                        className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-zinc-100">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-zinc-400">
                              Sem imagem
                            </span>
                          )}
                        </div>

                        <h2 className="mb-1 line-clamp-2 text-lg font-bold text-zinc-900">
                          {product.name}
                        </h2>

                        <p className="mb-3 text-sm text-zinc-500">
                          {
                            categories.find(
                              (
                                category,
                              ) =>
                                category.id ===
                                product.categoryId,
                            )?.name
                          }
                        </p>

                        {product.discount &&
                          product.discount > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-zinc-400 line-through">
                              R${" "}
                              {product.price.toFixed(
                                2,
                              )}
                            </span>

                            <span className="text-2xl font-bold text-green-600">
                              R${" "}
                              {(
                                product.price -
                                product.discount
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-zinc-900">
                            R${" "}
                            {product.price.toFixed(
                              2,
                            )}
                          </span>
                        )}

                        <p className="mt-2 text-sm text-zinc-500">
                          Estoque:{" "}
                          <strong>
                            {product.stock}
                          </strong>
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() =>
                              openEditModal(
                                product,
                              )
                            }
                            className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
                          >
                            <FaEdit />
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              openDeleteModal(
                                product,
                              )
                            }
                            className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                          >
                            <FaTrash />
                            Deletar
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
        {(createModalOpen ||
          editModalOpen) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-zinc-900">
                    {createModalOpen
                      ? 'Novo Produto'
                      : 'Editar Produto'}
                  </h2>
                  <div className="mt-3 h-1 w-24 rounded-full bg-zinc-800" />
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={
                        formData.name
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">
                      Preço
                    </label>
                    <input
                      type="number"
                      value={
                        formData.price
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">
                      Desconto
                    </label>
                    <input
                      type="number"
                      value={
                        formData.discount
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">
                      Estoque
                    </label>
                    <input
                      type="number"
                      value={
                        formData.stock
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">
                      Categoria
                    </label>
                    <select
                      value={
                        formData.categoryId
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryId:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                    >
                      <option value="">
                        Selecione
                      </option>
                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-zinc-700">
                      Imagem (URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={
                        formData.image
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                    />
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => {
                      setCreateModalOpen(
                        false,
                      );
                      setEditModalOpen(
                        false,
                      );
                    }}
                    className="rounded-xl bg-zinc-200 px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={
                      createModalOpen
                        ? handleCreateProduct
                        : handleEditProduct
                    }
                    className="rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700 cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-zinc-900">
                Confirmar exclusão
              </h2>
              <div className="mt-3 h-1 w-24 rounded-full bg-red-600" />
              <p className="mt-6 text-zinc-600">
                Deseja realmente deletar{' '}
                <strong>
                  {
                    selectedProduct?.name
                  }
                </strong>
                ?
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() =>
                    setDeleteModalOpen(
                      false,
                    )
                  }
                  className="rounded-xl bg-zinc-200 px-5 py-3 font-medium text-zinc-700 transition hover:bg-zinc-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={
                    handleDeleteProduct
                  }
                  className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 cursor-pointer"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </ProtectedRoute>
  )
}