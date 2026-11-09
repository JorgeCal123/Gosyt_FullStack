import { apiClient, tokenStorage } from '../../../lib/apiClient';
import type { LoginDTO, ActivateDTO, AuthResponse, ActivateResponse } from '../types';
import type { Usuario } from '../../usuarios/types';

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      tokenStorage.set(response.data.token);
    }
    return response.data;
  },

  async activate(data: ActivateDTO): Promise<ActivateResponse> {
    const response = await apiClient.post<ActivateResponse>('/auth/activate', data);
    return response.data;
  },

  async getMe(): Promise<Usuario> {
    const response = await apiClient.get<Usuario>('/auth/me');
    return response.data;
  },

  logout(): void {
    tokenStorage.remove();
  },
};
