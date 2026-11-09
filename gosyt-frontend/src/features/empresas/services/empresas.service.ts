import { apiClient } from '../../../lib/apiClient';
import type { Empresa, EmpresaResumenDTO } from '../types';

export const empresasService = {
  // owner_gosyt: resumen de todas las empresas clientes
  async listarResumenes(): Promise<EmpresaResumenDTO[]> {
    const response = await apiClient.get<EmpresaResumenDTO[]>('/empresas');
    return response.data;
  },

  // owner_gosyt: resumen de una sola empresa
  async getResumen(id: string): Promise<EmpresaResumenDTO> {
    const response = await apiClient.get<EmpresaResumenDTO>(`/empresas/${id}`);
    return response.data;
  },

  // admin_empresa: información de su propia empresa
  async getMiEmpresa(): Promise<Empresa> {
    const response = await apiClient.get<Empresa>('/empresas/mi-empresa');
    return response.data;
  },
};
