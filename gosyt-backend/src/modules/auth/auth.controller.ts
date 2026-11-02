import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const service = new AuthService();

export class AuthController {


    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await service.login(req.body ?? {});
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await service.activate(req.body ?? {}));
        } catch (error) {
            next(error);
        }
    }

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await service.me(req.user!.id);
            res.json(usuario);
        } catch (error) {
            next(error);
        }
    }
}