export interface LoginDTO {
    correo: string;
    password: string;
}

export interface ActivateDTO {
    token_activacion: string;
    nueva_password: string;
    confirmar_password: string;
}