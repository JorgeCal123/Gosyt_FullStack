/*import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from './usuarios.service';
import { CreateUsuarioDTO, UpdateUsuarioDTO } from './usuarios.dto';

const service = new UsuarioService();

export class UsuarioController {

    // descripcion: Método para crear un usuario (POST)
    // Parametros
    //  - req: Request<{}, {}, CreateUsuarioDTO>: Indica que la petición tendrá un cuerpo (body) del tipo CreateUsuarioDTO.
    //  - res: Response: Objeto para enviar la respuesta al cliente.
    //  - next: NextFunction: Función para pasar el control al siguiente middleware (en este caso errorHandler).
    // return: Promise<void> con un json con el usuario creado
    async create(req: Request<{}, {}, CreateUsuarioDTO>, res: Response, next: NextFunction) {
        try {
            const usuario = await service.create(req.body);
            const { password_hash, ...safeUser } = usuario.toJSON();
            res.status(201).json(safeUser);
        } catch (error) {
            next(error);
        }
    }

    // descripcion: Método para obtener todos los usuarios (GET)
    // Parametros
    //  - req: Request: no se usa porque no envia nada en la petición
    //  - res: Response: Objeto para enviar la respuesta al cliente.
    //  - next: NextFunction: Función para pasar el control al siguiente middleware (en este caso errorHandler).
    // return: Promise<void> con un json con todos los usuarios
    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await service.findAll());
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            res.json(await service.findById(req.params.id));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request<{ id: string }, {}, UpdateUsuarioDTO>, res: Response, next: NextFunction) {
        try {
            res.json(await service.update(req.params.id, req.body));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            res.json(await service.delete(req.params.id));
        } catch (error) {
            next(error);
        }
    }
}
    */