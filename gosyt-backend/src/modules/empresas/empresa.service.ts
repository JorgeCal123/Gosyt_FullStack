import { Empresa } from './model';
import { CreateEmpresaDTO, UpdateEmpresaDTO } from './empresa.dto';
import { AppError } from '../../core/errors/AppError';

export class EmpresaService {


    async create(data: CreateEmpresaDTO) {
        const existe = await Empresa.findOne({ where: { correo_contacto: data.correo_contacto } });
        if (existe) throw new AppError('Ya existe una empresa con ese correo', 409);
        return Empresa.create(data);
    }

    async findAll() {
        return Empresa.findAll();
    }

    async findById(id: string) {
        const empresa = await Empresa.findByPk(id);
        if (!empresa) throw new AppError('Empresa no encontrada', 404);
        return empresa;
    }

    async update(id: string, data: UpdateEmpresaDTO) {
        const empresa = await this.findById(id);
        return empresa.update(data);
    }

    async delete(id: string) {
        const empresa = await this.findById(id);
        await empresa.destroy();
        return { message: 'Empresa eliminada' };
    }
}