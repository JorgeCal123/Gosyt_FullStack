import type { Empresa } from '../../empresas/types';

export type Rol = 'owner_gosyt' | 'admin_empresa' | 'coordinador' | 'tecnico';

export type EstadoHabilitacion = 'Activo' | 'Inactivo';

export type EstadoCredenciales = 'PENDIENTE_CREACION' | 'CONTRASEÑA_CREADA';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula?: string;
  tipo_documento?: string;
  correo: string;
  telefono: string;
  rol: Rol;
  estado_habilitacion: EstadoHabilitacion;
  estado_credenciales: EstadoCredenciales;
  avatar_url?: string | null;
  mustChangePassword?: boolean;
  empresa_id?: string | null;
  empresa?: Empresa | null;
  createdAt?: string;
  updatedAt?: string;
}
