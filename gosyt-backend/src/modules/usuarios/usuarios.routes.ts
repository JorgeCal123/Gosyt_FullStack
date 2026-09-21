import { Router } from 'express';
import { UsuarioController } from './usuarios.controller';

const router = Router();
const controller = new UsuarioController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;