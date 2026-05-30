'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaTrash } from 'react-icons/fa';

import { Container } from '@/components/layout/Container';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import {
  deleteUser,
  getUsers,
  User,
} from '@/services/users-service';

import { useAuthStore } from '@/store/auth-store';

export default function AdminUsersPage() {
  const authUser =
    useAuthStore(
      (state) => state.user,
    );

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [selectedUser, setSelectedUser] =
    useState<User | null>(
      null,
    );

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);

      const data =
        await getUsers();

      const ordered =
        data.sort((a, b) => {
          if (
            a.role === 'admin' &&
            b.role !== 'admin'
          ) {
            return -1;
          }

          if (
            a.role !== 'admin' &&
            b.role === 'admin'
          ) {
            return 1;
          }

          return a.name.localeCompare(
            b.name,
          );
        });

      setUsers(
        ordered,
      );
    } catch (error) {
      console.log(error);

      setErrorMessage(
        'Erro ao carregar usuários.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function clearMessages() {
    setErrorMessage('');
    setSuccessMessage('');
  }

  function openDeleteModal(
    user: User,
  ) {
    clearMessages();

    setSelectedUser(
      user,
    );

    setDeleteModalOpen(true);
  }

  async function handleDeleteUser() {
    try {
      clearMessages();

      if (
        !selectedUser
      ) {
        return;
      }

      if (
        selectedUser.id ===
        authUser?.userId
      ) {
        setErrorMessage(
          'Você não pode deletar seu próprio usuário.',
        );

        return;
      }

      await deleteUser(
        selectedUser.id,
      );

      setSuccessMessage(
        'Usuário deletado com sucesso.',
      );

      setDeleteModalOpen(false);

      loadUsers();
    } catch (error) {
      console.log(error);

      setErrorMessage(
        'Erro ao deletar usuário.',
      );
    }
  }

  const filteredUsers =
    useMemo(() => {
      return users.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ) ||
          user.email
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ),
      );
    }, [users, search]);

  return (
    <ProtectedRoute adminOnly>
    <main className="h-screen overflow-hidden bg-[#f4f4f5] pt-20">
        <Container>
          <div className="flex h-[calc(100vh-5rem)] flex-col md:ml-64">

            {/* TOPO FIXO */}
            <div className="shrink-0 bg-[#f4f4f5] p-4 md:p-6">

              {/* TOPO */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">
                  Usuários
                </h1>

                <div className="mt-3 h-1 w-24 rounded-full bg-zinc-800" />
              </div>

              {/* ALERTAS */}
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

              {/* SEARCH */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <input
                  type="text"
                  placeholder="Buscar usuário..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"
                />
              </div>
            </div>

            {/* CONTEÚDO COM SCROLL */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 md:px-6">

              {loading ? (
                <p className="text-zinc-400">
                  Carregando...
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredUsers.map(
                    (user) => (
                      <div
                        key={user.id}
                        className="
                          flex
                          min-h-[260px]
                          flex-col
                          justify-between
                          rounded-2xl
                          border
                          border-zinc-200
                          bg-white
                          p-5
                          shadow-sm
                          transition-all
                          duration-200
                          hover:-translate-y-1
                          hover:shadow-md
                        "
                      >
                        <div className="flex flex-1 flex-col">

                          <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="line-clamp-2 text-xl font-bold text-zinc-900">
                              {user.name}
                            </h2>

                            {user.role === 'admin' && (
                              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                Admin
                              </span>
                            )}
                          </div>

                          <div className="space-y-3">

                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                E-mail
                              </span>

                              <p className="mt-1 break-words text-sm text-zinc-700">
                                {user.email}
                              </p>
                            </div>

                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                Role
                              </span>

                              <p className="mt-1 text-sm font-medium capitalize text-zinc-800">
                                {user.role}
                              </p>
                            </div>

                          </div>
                        </div>

                        <div className="mt-6">
                          <button
                            onClick={() =>
                              openDeleteModal(user)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 cursor-pointer"
                          >
                            <FaTrash size={14} />
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

        {/* MODAL DELETE */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

              <h2 className="mb-4 text-2xl font-bold text-white">
                Confirmar exclusão
              </h2>

              <p className="mb-6 text-zinc-300">
                Deseja realmente deletar{' '}
                <strong className="text-white">
                  {selectedUser?.name}
                </strong>
                ?
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() =>
                    setDeleteModalOpen(false)
                  }
                  className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition hover:bg-zinc-700"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleDeleteUser}
                  className="cursor-pointer rounded-xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
