import { Request, Response, NextFunction } from 'express';
import { SolicitudService } from './solicitudes.service';
import { env } from '../../config/env';

const service = new SolicitudService();

export class SolicitudController {
  // Pública
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const solicitud = await service.crear(req.body ?? {});
      res.status(201).json({
        message: 'Solicitud recibida. Te contactaremos cuando sea revisada.',
        id: solicitud._id,
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
      res.json(await service.listar(estado));
    } catch (error) {
      next(error);
    }
  }

  async aceptar(req: Request, res: Response, next: NextFunction) {
    try {
      const { empresa, admin, token_activacion } = await service.aceptar(String(req.params.id));
      res.json({
        message: 'Solicitud aceptada. Empresa y administrador creados.',
        empresa,
        admin,
        // Solo en desarrollo, mientras no exista el envío de correos.
        ...(env.nodeEnv === 'development' && { token_activacion }),
      });
    } catch (error) {
      next(error);
    }
  }

  async rechazar(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await service.rechazar(String(req.params.id)));
    } catch (error) {
      next(error);
    }
  }
}
