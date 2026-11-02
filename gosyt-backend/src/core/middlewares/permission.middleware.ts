import { Request, Response, NextFunction } from 'express';
import { roleHasPermission } from '../permissions/permissions';
import { AppError } from '../errors/AppError';

export function requirePermission(permission: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('No autorizado', 401));
        }
        if (!roleHasPermission(req.user.rol, permission)) {
            return next(new AppError('No tienes permiso para esta acción', 403));
        }
        next();
    };
}