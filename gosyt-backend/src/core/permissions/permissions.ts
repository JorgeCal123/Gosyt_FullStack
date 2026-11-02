// Catálogo de permisos.

export const PERMISSIONS = {
  // Auth
  AUTH_ME: 'auth:me',

  // Solicitudes de prueba gratuita
  SOLICITUDES_READ: 'solicitudes:read',
  SOLICITUDES_REVIEW: 'solicitudes:review', // aceptar o rechazar


  // Empresas (owner_gosyt administra la plataforma)
  EMPRESA_READ_GENERAL: 'empresa:read:general',
  EMPRESA_READ_OWN: 'empresa:read:own',       // ver la propia empresa (admin_empresa)
  EMPRESA_UPDATE_OWN: 'empresa:update:own',

  // Planes y suscripciones

  PLANES_MANAGE: 'planes:manage',
  SUSCRIPCIONES_READ: 'suscripciones:read',

  // Empleados (REQ_USU_01, REQ_USU_09)
  EMPLOYEES_CREATE: 'employees:create',
  EMPLOYEES_READ: 'employees:read',
  EMPLOYEES_ROLE_UPDATE: 'employees:role:update',

  // Validación interna de aislamiento multi-tenant (REQ_EMP_01)
  EMPRESA_AISLAMIENTO_VALIDAR: 'empresa:aislamiento:validar',
} as const;

//export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type Rol = 'owner_gosyt' | 'admin_empresa' | 'coordinador' | 'tecnico';

//const OWNER_WILDCARD = '*';
const COORDINADOR_PERMISSIONS: string[] = [
  PERMISSIONS.AUTH_ME,
  // Se amplía cuando construyamos Tareas
];

const TECNICO_PERMISSIONS: string[] = [
  PERMISSIONS.AUTH_ME,
  // Se amplía cuando construyamos Tareas
];

export const ROLE_PERMISSIONS: Record<Rol, string[]> = {
  owner_gosyt: [
    PERMISSIONS.AUTH_ME,
    PERMISSIONS.SOLICITUDES_READ,
    PERMISSIONS.SOLICITUDES_REVIEW,
    PERMISSIONS.EMPRESA_READ_GENERAL,
    PERMISSIONS.PLANES_MANAGE,
    PERMISSIONS.SUSCRIPCIONES_READ,
  ],
  admin_empresa: [
    ...COORDINADOR_PERMISSIONS,
    PERMISSIONS.EMPRESA_READ_OWN,
    PERMISSIONS.EMPRESA_UPDATE_OWN,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_READ,
    PERMISSIONS.EMPLOYEES_ROLE_UPDATE,
  ],

  coordinador: COORDINADOR_PERMISSIONS,
  tecnico: TECNICO_PERMISSIONS,
};

/**
 * 
 * @param rol 
 * @param permission 
 * @returns 
 */
export function roleHasPermission(rol: Rol, permission: string): boolean {
  return (ROLE_PERMISSIONS[rol] ?? []).includes(permission);
}