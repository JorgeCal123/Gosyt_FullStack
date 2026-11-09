import { apiClient } from '../../../lib/apiClient';
import type {
  ISolicitud,
  CreateSolicitudDTO,
  AceptarSolicitudResponse,
  RechazarSolicitudResponse,
} from '../types';

export const solicitudesService = {
  async listar(estado?: string): Promise<ISolicitud[]> {
    const params = estado ? { estado } : {};
    const response = await apiClient.get<ISolicitud[]>('/solicitudes', { params });
    return response.data;
  },

  async crear(data: CreateSolicitudDTO): Promise<{ message: string; id: string }> {
    const response = await apiClient.post<{ message: string; id: string }>('/solicitudes', data);
    return response.data;
  },

  async aceptar(id: string): Promise<AceptarSolicitudResponse> {
    const response = await apiClient.post<AceptarSolicitudResponse>(`/solicitudes/${id}/aceptar`);
    return response.data;
  },

  async rechazar(id: string): Promise<RechazarSolicitudResponse> {
    const response = await apiClient.post<RechazarSolicitudResponse>(`/solicitudes/${id}/rechazar`);
    return response.data;
  },
};
