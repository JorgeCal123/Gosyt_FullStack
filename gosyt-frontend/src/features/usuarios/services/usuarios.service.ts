import { apiClient } from '../../../lib/apiClient';
import type { Usuario } from '../types';

export const usuariosService = {
  async getMe(): Promise<Usuario> {
    const response = await apiClient.get<Usuario>('/auth/me');
    return response.data;
  },
};
