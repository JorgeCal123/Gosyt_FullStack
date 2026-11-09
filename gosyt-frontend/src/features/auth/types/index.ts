import type { Usuario } from '../../usuarios/types';

export interface LoginDTO {
  correo: string;
  password: string;
}

export interface ActivateDTO {
  token_activacion: string;
  nueva_password: string;
  confirmar_password: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface ActivateResponse {
  message: string;
}
