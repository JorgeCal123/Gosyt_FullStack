// Interface con la estructura de los datos que va a 
// recibir para actualizar o crear una empresa
export interface CreateEmpresaDTO {
    nombre: string;
    correo_contacto: string;
    telefono: string;
    logo_url?: string;
    estado: 'Activa' | 'Inactiva';
}

// DTO (Data Transfer Object) 
// Es un objeto que permite recibir datos parciales o completos
// Para la actualización de una empresa no es necesario enviar todos los campos
// isActive es un campo opcional que permite habilitar o deshabilitar una empresa
export interface UpdateEmpresaDTO extends Partial<CreateEmpresaDTO> {
    isActive?: boolean;
}


// Lo único que el owner_gosyt puede ver de una empresa cliente
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
    fecha_registro: Date;
    dias_con_servicio: number;
}
