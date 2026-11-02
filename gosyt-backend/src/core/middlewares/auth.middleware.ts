import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { Usuario } from '../../modules/usuarios/usuarios.model';
import { AppError } from '../errors/AppError';

// Extendemos el tipo Request para incluir el usuario autenticado
declare global { namespace Express { interface Request { user?: JwtPayload; } } }

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('Token no proporcionado', 401);
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);

        // Regla REQ_AUT_08: si la cuenta fue inactivada después de emitir el token, rechaza
        const usuario = await Usuario.findByPk(payload.id);
        if (!usuario) throw new AppError('Usuario no encontrado', 401);
        if (usuario.estado_habilitacion !== 'Activo') {
            throw new AppError('Cuenta inactiva', 401);
        }

        req.user = payload;
        next();
    } catch (error) {
        next(new AppError('No autorizado', 401));
    }
}