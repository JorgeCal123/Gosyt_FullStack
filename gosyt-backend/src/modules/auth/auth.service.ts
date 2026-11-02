import { Usuario } from '../usuarios/usuarios.model';
import { Empresa } from '../empresas/empresa.model';
import { comparePassword, hashPassword } from '../../core/utils/hash';
import { signToken } from '../../core/utils/jwt';
import { hashToken } from '../../core/utils/token';
import { isEmail } from '../../core/utils/validators';
import { AppError } from '../../core/errors/AppError';
import { Rol } from '../../core/permissions/permissions';
import { LoginDTO, ActivateDTO } from './auth.dto';

const MIN_PASSWORD_LENGTH = 8;

export class AuthService {

    /*
        async login(data: LoginDTO) {
            // Regla 1: el correo debe corresponder a un usuario registrado
            const usuario = await Usuario.findOne({ where: { correo: data.correo } });
            if (!usuario) throw new AppError('Credenciales incorrectas', 401);
    
            // Regla 2-3: la contraseña debe coincidir
            const passwordValida = await comparePassword(data.password, usuario.password_hash);
            if (!passwordValida) throw new AppError('Credenciales incorrectas', 401);
    
            // Regla 4: cuenta INACTIVA no puede iniciar sesión
            if (usuario.estado_habilitacion !== 'Activo') {
                throw new AppError(
                    'Tu cuenta se encuentra inactiva. Contacta al administrador de tu empresa.',
                    403
                );
            }
    
            // Regla 5: estado_credenciales PENDIENTE_CREACION no puede iniciar sesión
            if (usuario.estado_credenciales === 'PENDIENTE_CREACION') {
                throw new AppError(
                    'Debes completar la creación de tu contraseña antes de iniciar sesión.',
                    403
                );
            }
    
            // Reglas 6-9: vigencia del plan según el rol
            await this.validarVigenciaPlan(usuario.rol, usuario.empresa_id);
    
            // Regla 11: crear/autenticar la sesión (JWT)
            const token = signToken({
                id: usuario.id,
                rol: usuario.rol as JwtRol,
                empresa_id: usuario.empresa_id,
            });
    
            const { password_hash, ...usuarioSeguro } = usuario.toJSON();
            return { token, usuario: usuarioSeguro };
        }
    **/
    async login(data: Partial<LoginDTO>) {
        // Validaciones de entrada correo y contraseña
        if (!data.correo || !data.password) {
            throw new AppError('Correo y contraseña son obligatorios', 400);
        }
        const correo = data.correo.trim().toLowerCase();
        if (!isEmail(correo)) {
            throw new AppError('El formato del correo no es válido', 400);
        }

        //Búsqueda y Verificación de Credenciales
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) throw new AppError('usuario no encontrado', 401);

        const passwordValida = await comparePassword(data.password, usuario.password_hash);
        if (!passwordValida) throw new AppError('contraseña incorrecta', 401);

        //Validación de Estado de la Cuenta
        if (usuario.estado_habilitacion !== 'Activo') {
            throw new AppError('Tu cuenta se encuentra inactiva. Contacta al administrador de tu empresa.', 403);
        }

        if (usuario.estado_credenciales === 'PENDIENTE_CREACION') {
            throw new AppError('Debes completar la creación de tu contraseña antes de iniciar sesión.', 403);
        }

        // validacion de la Vigencia del Plan de este usuario
        await this.validarVigenciaPlan(usuario.rol, usuario.empresa_id);

        //Generación del Token (JWT)
        const token = signToken({
            id: usuario.id,
            rol: usuario.rol as Rol,
            empresa_id: usuario.empresa_id,
        });

        const { password_hash, token_seguridad, token_expiracion, ...usuarioSeguro } = usuario.toJSON();
        return { token, usuario: usuarioSeguro };
    }
    // Regla 9: owner_gosyt no depende del plan.
    // Regla 8: admin_empresa accede aunque el plan esté vencido.
    // Reglas 6-7: coordinador/tecnico requieren plan vigente.
    //
    // TODO: cuando construyamos el módulo Suscripciones, reemplazar esta validación
    // por una consulta real a la suscripción activa de la empresa (estado_suscripcion,
    // fecha_vencimiento). Por ahora usamos Empresa.estado / trialExpiresAt como proxy.
    private async validarVigenciaPlan(rol: string, empresa_id: string | null) {
        if (rol === 'owner_gosyt' || rol === 'admin_empresa') return;

        if (!empresa_id) {
            throw new AppError('Usuario sin empresa asociada', 403);
        }

        const empresa = await Empresa.findByPk(empresa_id);
        const planVencido =
            !empresa ||
            empresa.estado !== 'Activa' ||
            (empresa.trialExpiresAt && new Date(empresa.trialExpiresAt) < new Date());

        if (planVencido) {
            throw new AppError(
                'El plan de tu empresa se encuentra vencido. Contacta al administrador que contrató el servicio para restablecer el acceso.',
                403
            );
        }
    }

    // REQ_AUT_02: creación inicial de contraseña mediante enlace
    async activate(data: Partial<ActivateDTO>) {
        const { token_activacion, nueva_password, confirmar_password } = data;

        if (!token_activacion || !nueva_password || !confirmar_password) {
            throw new AppError('Token, contraseña y confirmación son obligatorios', 400);
        }
        if (nueva_password !== confirmar_password) {
            throw new AppError('Las contraseñas no coinciden', 400);
        }
        if (nueva_password.length < MIN_PASSWORD_LENGTH) {
            throw new AppError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`, 400);
        }

        const usuario = await Usuario.findOne({
            where: { token_seguridad: hashToken(token_activacion), estado_credenciales: 'PENDIENTE_CREACION' },
        });

        if (!usuario || !usuario.token_expiracion || new Date(usuario.token_expiracion) < new Date()) {
            throw new AppError('El enlace no es válido o ya venció', 400);
        }

        const password_hash = await hashPassword(nueva_password);

        // Al borrar el token, el enlace queda invalidado (no se puede usar dos veces)
        await usuario.update({
            password_hash,
            estado_credenciales: 'CONTRASEÑA_CREADA',
            token_seguridad: null,
            token_expiracion: null,
        });

        return { message: 'Contraseña creada correctamente. Ya puedes iniciar sesión.' };
    }


    async me(userId: string) {
        const usuario = await Usuario.findByPk(userId, {
            attributes: { exclude: ['password_hash', 'token_seguridad', 'token_expiracion'] },
            include: [{ association: 'empresa' }],
        });
        if (!usuario) throw new AppError('Usuario no encontrado', 404);
        return usuario;
    }
}
