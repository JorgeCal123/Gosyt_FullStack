import { Router } from 'express';
import { EmpresaController } from './empresa.controller';
import { authMiddleware } from '../../core/middlewares/auth.middleware';
import { requirePermission } from '../../core/middlewares/permission.middleware';
import { PERMISSIONS } from '../../core/permissions/permissions';

const router = Router();
const controller = new EmpresaController();

// Este módulo exige sesión iniciada
router.use(authMiddleware);

/*
router.post('/', controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
*/

router.get('/mi-empresa', requirePermission(PERMISSIONS.EMPRESA_READ_OWN), controller.miEmpresa.bind(controller));
router.get('/', requirePermission(PERMISSIONS.EMPRESA_READ_GENERAL), controller.listarResumenes.bind(controller));
router.get('/:id', requirePermission(PERMISSIONS.EMPRESA_READ_GENERAL), controller.resumen.bind(controller));

export default router;