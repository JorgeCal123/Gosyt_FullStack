import { Request, Response, NextFunction } from 'express';
import { EmpresaService } from './empresa.service';
//import { CreateEmpresaDTO, UpdateEmpresaDTO } from './empresa.dto';
import { AppError } from '../../core/errors/AppError';

const service = new EmpresaService();

export class EmpresaController {

    // owner_gosyt: resumen general de todas las empresas clientes (excluye la empresa interna GoSYT)
    async listarResumenes(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await service.listarResumenes(req.user!.empresa_id));
        } catch (error) {
            next(error);
        }
    }

    // owner_gosyt: resumen general de una empresa
    async resumen(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await service.resumenGeneral(String(req.params.id)));
        } catch (error) {
            next(error);
        }
    }

    // admin_empresa: su propia empresa. El id sale del token, nunca de lo que envía el cliente.
    async miEmpresa(req: Request, res: Response, next: NextFunction) {
        try {
            const empresaId = req.user!.empresa_id;
            if (!empresaId) throw new AppError('Tu usuario no tiene empresa asociada', 404);
            res.json(await service.findById(empresaId));
        } catch (error) {
            next(error);
        }
    }
}

/*
// descripcion: Método para crear una empresa (POST)
// Parametros
//  - req: Request<{}, {}, CreateEmpresaDTO>: Indica que la petición tendrá un cuerpo (body) del tipo CreateEmpresaDTO.
//  - res: Response: Objeto para enviar la respuesta al cliente.
//  - next: NextFunction: Función para pasar el control al siguiente middleware (nuestro errorHandler).
// return: Promise<void> con un json con la empresa creada
async create(req: Request<{}, {}, CreateEmpresaDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
        const empresa = await service.create(req.body);
        res.status(201).json(empresa);
    } catch (error) {
        next(error);
    }
}

// descripcion: Método para obtener todas las empresas (GET)
// Parametros
//  - req: Request: no se usa porque no envia nada en la petición
//  - res: Response: Objeto para enviar la respuesta al cliente.
//  - next: NextFunction: Función para pasar el control al siguiente middleware (en este caso errorHandler).
// return: Promise<void> con un json con todas las empresas
async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await service.findAll());
    } catch (error) {
        next(error);
    }
}

// descripcion: Método para obtener una empresa por su id (GET)
// Parametros
//  - req: Request<{}, { id: string }>: Indica que la petición tendrá un parámetro id (string).
//  - res: Response: Objeto para enviar la respuesta al cliente.
//  - next: NextFunction: Función para pasar el control al siguiente middleware (en este caso errorHandler).
// return: Promise<void> con un json con la empresa que busca por id
async getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        res.json(await service.findById(req.params.id));
    } catch (error) {
        next(error);
    }
}

// descripcion: Método para actualizar una empresa por su id (PUT)
// Parametros
//  - req: Request<{ id: string }, {}, UpdateEmpresaDTO>: Indica que la petición tendrá un parámetro id (string) y un cuerpo (body) del tipo UpdateEmpresaDTO.
//  - res: Response: Objeto para enviar la respuesta al cliente.
//  - next: NextFunction: Función para pasar el control al siguiente middleware (en este caso errorHandler).
// return: Promise<void> con un json con la empresa actualizada
async update(req: Request<{ id: string }, {}, UpdateEmpresaDTO>, res: Response, next: NextFunction) {
    try {
        res.json(await service.update(req.params.id, req.body));
    } catch (error) {
        next(error);
    }
}

// descripcion: Método para eliminar una empresa por su id (DELETE)
// Parametros
//  - req: Request<{ id: string }>: Indica que la petición tendrá un parámetro id (string).
//  - res: Response: Objeto para enviar la respuesta al cliente.
//  - next: NextFunction: Función para pasar el control al siguiente middleware (en este caso errorHandler).
// return: Promise<void> con un json con la empresa eliminada
async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        res.json(await service.delete(req.params.id));
    } catch (error) {
        next(error);
    }
}

}
        */