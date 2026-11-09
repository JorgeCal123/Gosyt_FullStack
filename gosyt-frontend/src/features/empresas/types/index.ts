export interface Empresa {
  id: string;
  nombre: string;
  correo_contacto: string;
  telefono: string;
  logo_url?: string | null;
  estado: string;
  trialExpiresAt?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmpresaResumenDTO {
  id: string;
  nombre: string;
  correo_contacto: string;
  telefono: string;
  logo_url: string | null;
  estado: string;
  isActive: boolean;
  cantidad_coordinadores: number;
  cantidad_tecnicos: number;
  tipo_suscripcion: string | null;
  fecha_registro: string | Date;
  dias_con_servicio: number;
}

export interface CreateEmpresaDTO {
  nombre: string;
  correo_contacto: string;
  telefono: string;
  logo_url?: string;
  estado: 'Activa' | 'Inactiva';
}

export interface UpdateEmpresaDTO extends Partial<CreateEmpresaDTO> {
  isActive?: boolean;
}

