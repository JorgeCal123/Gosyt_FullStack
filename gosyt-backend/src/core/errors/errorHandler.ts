import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

// --- Función para manejar errores si es una instancia de AppError o si es un error general del servidor---
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
}