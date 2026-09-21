import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;


// descripcion: Función para generar el hash a una contraseña
// Parametros
//  - password: string: Contraseña a hashear
// return: Promise<string> con el hash de la contraseña
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}
/*
 descripcion: Función para comparar una contraseña con su hash
 Parametros
  - password: string: Contraseña a comparar
  - hash: string: Hash de la contraseña
 return: Promise<boolean> true si la contraseña es correcta, false en caso contrario
**/
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}