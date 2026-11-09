import axios, { AxiosError } from 'axios';
import { config } from '../config/env';

const TOKEN_KEY = 'gosyt_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
};

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el JWT en los headers
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = tokenStorage.get();
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejo centralizado de respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      tokenStorage.remove();
    }
    return Promise.reject(error);
  }
);

// Utilidad para extraer el mensaje legible de error del backend
export function getApiErrorMessage(error: unknown, fallbackMessage = 'Ha ocurrido un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      if ('error' in data && typeof data.error === 'string') {
        return data.error;
      }
      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }
    }
    if (error.response?.statusText) {
      return `Error (${error.response.status}): ${error.response.statusText}`;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}

