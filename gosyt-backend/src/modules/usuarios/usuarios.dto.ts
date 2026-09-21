export interface CreateUsuarioDTO {
    nombre: string;
    apellido: string;
    cedula: string;
    tipo_documento: string;
    correo: string;
    telefono: string;
    password: string; // texto plano, se hashea en el service
    rol: 'owner_gosyt' | 'admin_empresa' | 'coordinador' | 'tecnico';
    empresa_id?: string;
}

export interface UpdateUsuarioDTO
    extends Partial<Omit<CreateUsuarioDTO, 'password'>> {
    estado_habilitacion?: 'Activo' | 'Inactivo';
    mustChangePassword?: boolean;
}