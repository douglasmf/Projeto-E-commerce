import axios, { AxiosHeaders } from 'axios';

export const api = axios.create({
  baseURL: 'https://projeto-e-commerce-9gmz.onrender.com' || 'http://localhost:3000',
});

let interceptorAdded = false;

export function setupApiInterceptor() {
  if (interceptorAdded) return;
  interceptorAdded = true;

  api.interceptors.request.use((config) => {
    // garante que temos um AxiosHeaders
    const headers = new AxiosHeaders(config.headers || {});
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    config.headers = headers;
    return config;
  });
}

// Try to initialize on client-side only
if (typeof window !== 'undefined') {
  setupApiInterceptor();
}
