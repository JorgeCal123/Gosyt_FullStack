import type { Empresa } from '../../empresas/types';
import type { Usuario } from '../../usuarios/types';

export const ESTADOS_SOLICITUD = ['Pendiente', 'Aceptada', 'Rechazada'] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

export interface ISolicitud {
  id: string;
  nombre_empresa: string;
  nombre_solicitante: string;
  apellido_solicitante: string;
  correo: string;
  telefono: string;
  estado: EstadoSolicitud;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSolicitudDTO {
  nombre_empresa: string;
  nombre_solicitante: string;
  apellido_solicitante: string;
  correo: string;
  telefono: string;
}

export interface AceptarSolicitudResponse {
  message: string;
  empresa: Empresa;
  admin: Usuario;
  token_activacion?: string;
}

export interface RechazarSolicitudResponse {
  message: string;
}
