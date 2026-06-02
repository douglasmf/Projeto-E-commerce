'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { jwtDecode } from 'jwt-decode';

import { api } from '@/services/api';

import { useAuthStore } from '@/store/auth-store';
import { AxiosError } from 'axios';

interface LoginFormData {
  email: string;

  password: string;
}

interface RegisterFormData {
  name: string;

  email: string;

  password: string;
}

interface DecodedToken {
  sub: number;

  email: string;

  role: 'ADMIN' | 'USER';
}

export default function AuthPage() {
  const router = useRouter();

  const setAuth = useAuthStore(
    (state) => state.setAuth,
  );

  const [registerModalOpen, setRegisterModalOpen] =
    useState(false);

  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const [loginSuccessMessage, setLoginSuccessMessage] =
    useState('');

  const [registerErrorMessage, setRegisterErrorMessage] =
    useState('');

  const [registerSuccessMessage, setRegisterSuccessMessage] =
    useState('');

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
  } = useForm<LoginFormData>();

  const {
    register: registerUserRegister,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegisterForm,
  } = useForm<RegisterFormData>();

  async function handleLogin(
    data: LoginFormData,
  ) {
    try {
      setLoginErrorMessage('');

      const response = await api.post(
        '/auth/login',
        data,
      );

      const token =
        response.data.access_token;

      const decoded =
        jwtDecode<DecodedToken>(
          token,
        );

      setAuth(token, {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      });

      localStorage.setItem(
        'token',
        token,
      );

      await fetch(
        '/api/auth/callback',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            token,
          }),
        },
      );

      router.push('/');
    } catch (error) {
      console.log(error);

      setLoginErrorMessage(
        'Email ou senha inválidos.',
      );
    }
  }

  async function handleRegister(
    data: RegisterFormData,
  ) {
    try {
      setRegisterErrorMessage('');

      setRegisterSuccessMessage('');

      if (
        !data.name.trim()
      ) {
        setRegisterErrorMessage(
          'Informe seu nome.',
        );

        return;
      }

      if (
        !data.email.trim()
      ) {
        setRegisterErrorMessage(
          'Informe seu email.',
        );

        return;
      }

      if (data.password.length < 8) {
        setRegisterErrorMessage(
          'A senha deve possuir ao menos 8 caracteres.',
        );

        return;
      }

      await api.post(
        '/users',
        {
          name: data.name,
          email: data.email,
          password:
            data.password,
        },
      );

      setRegisterSuccessMessage(
        'Cadastro realizado com sucesso. Faça login para continuar.',
      );

      // alerta rápido ao usuário informando sucesso no cadastro
      if (typeof window !== 'undefined') {
        window.alert('Cadastro realizado com sucesso. Faça login para continuar.');
      }

      resetRegisterForm();

      setRegisterModalOpen(
        false,
      );
    } catch (error) {
      console.log(error);

      const err = error as AxiosError<{ message?: string }>;
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message ?? '';

      if (status === 409 || backendMessage.toLowerCase().includes('email')) {
        setRegisterErrorMessage('Email já existe.');
      } else {
        setRegisterErrorMessage('Erro ao realizar cadastro.');
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-200 px-4">
      <form
        onSubmit={handleLoginSubmit(
          handleLogin,
        )}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Login
          </h1>

          <p className="mt-2 text-zinc-500">
            Entre na sua conta
          </p>
        </div>

        {loginSuccessMessage && (
          <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {loginSuccessMessage}
          </div>
        )}

        {loginErrorMessage && (
          <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {loginErrorMessage}
          </div>
        )}

        <div>
          <label className="mb-1 block font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Digite seu email"
            {...loginRegister(
              'email',
            )}
            className="w-full rounded-md border border-zinc-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Senha
          </label>

          <input
            type="password"
            placeholder="Digite sua senha"
            {...loginRegister(
              'password',
            )}
            className="w-full rounded-md border border-zinc-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
        >
          Entrar
        </button>

        <div className="mt-2 text-center text-sm text-zinc-600">
          Não possui cadastro?
          {' '}

          <button
            type="button"
            onClick={() => {
              setRegisterModalOpen(true);
              setRegisterErrorMessage('');
              setRegisterSuccessMessage('');
              resetRegisterForm();
            }}
            className="font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Cadastre-se
          </button>
        </div>
      </form>

      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Criar conta
                </h2>

                <p className="text-sm text-zinc-500">
                  Preencha os dados abaixo
                </p>
              </div>

              <button
                onClick={() => {
                  setRegisterModalOpen(false);
                  setRegisterErrorMessage('');
                  setRegisterSuccessMessage('');
                  resetRegisterForm();
                }}
                className="text-xl font-bold text-zinc-500 cursor-pointer"
              >
                ×
              </button>
            </div>

            {registerSuccessMessage && (
              <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700 mb-4">
                {registerSuccessMessage}
              </div>
            )}

            {registerErrorMessage && (
              <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 mb-4">
                {registerErrorMessage}
              </div>
            )}

            <form
              onSubmit={handleRegisterSubmit(
                handleRegister,
              )}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="mb-1 block font-medium">
                  Nome
                </label>

                <input
                  type="text"
                  placeholder="Digite seu nome"
                  {...registerUserRegister(
                    'name',
                  )}
                  className="w-full rounded-md border border-zinc-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Digite seu email"
                  {...registerUserRegister(
                    'email',
                  )}
                  className="w-full rounded-md border border-zinc-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Senha
                </label>

                <input
                  type="password"
                  placeholder="Crie uma senha"
                  {...registerUserRegister(
                    'password',
                  )}
                  className="w-full rounded-md border border-zinc-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-md bg-green-600 p-3 font-semibold text-white transition hover:bg-green-700 cursor-pointer"
              >
                Criar conta
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
