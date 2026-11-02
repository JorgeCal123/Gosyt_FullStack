import { Router } from 'express';
import { SolicitudController } from './solicitudes.controller';
import { authMiddleware } from '../../core/middlewares/auth.middleware';
import { requirePermission } from '../../core/middlewares/permission.middleware';
import { PERMISSIONS } from '../../core/permissions/permissions';

const router = Router();
const controller = new SolicitudController();

// Pública: la empresa que quiere probar GoSYT no tiene cuenta todavía
router.post('/', controller.crear.bind(controller));

// Solo owner_gosyt
router.get('/', authMiddleware, requirePermission(PERMISSIONS.SOLICITUDES_READ), controller.listar.bind(controller));
router.post('/:id/aceptar', authMiddleware, requirePermission(PERMISSIONS.SOLICITUDES_REVIEW), controller.aceptar.bind(controller));
router.post('/:id/rechazar', authMiddleware, requirePermission(PERMISSIONS.SOLICITUDES_REVIEW), controller.rechazar.bind(controller));

export default router;
