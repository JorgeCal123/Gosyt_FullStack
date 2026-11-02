import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../core/middlewares/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.post('/activate', controller.activate.bind(controller));
router.get('/me', authMiddleware, controller.me.bind(controller));

export default router;