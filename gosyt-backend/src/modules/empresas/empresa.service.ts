import { Empresa } from './empresa.model';
import { CreateEmpresaDTO, UpdateEmpresaDTO, EmpresaResumenDTO } from './empresa.dto';
import { AppError } from '../../core/errors/AppError';


import { col, fn, Op } from 'sequelize';
import { Usuario } from '../usuarios/usuarios.model';
import { isUuid } from '../../core/utils/validators';

type Conteos = Map<string, { coordinadores: number; tecnicos: number }>;

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
        if (!isUuid(id)) throw new AppError('Empresa no encontrada', 404);
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

    // ---- Vista del owner_gosyt: solo información general ----

    async resumenGeneral(id: string): Promise<EmpresaResumenDTO> {
        const empresa = await this.findById(id);
        const conteos = await this.contarPorRol([empresa.id]);
        return this.armarResumen(empresa, conteos);
    }

    async listarResumenes(excluirEmpresaId?: string | null): Promise<EmpresaResumenDTO[]> {
        const empresas = await Empresa.findAll({
            where: excluirEmpresaId ? { id: { [Op.ne]: excluirEmpresaId } } : {},
            order: [['createdAt', 'DESC']],
        });

        const conteos = await this.contarPorRol(empresas.map((e) => e.id));
        return empresas.map((e) => this.armarResumen(e, conteos));
    }

    private async contarPorRol(ids: string[]): Promise<Conteos> {
        const conteos: Conteos = new Map();
        if (ids.length === 0) return conteos;

        const filas = (await Usuario.findAll({
            attributes: ['empresa_id', 'rol', [fn('COUNT', col('id')), 'total']],
            where: { empresa_id: { [Op.in]: ids }, rol: { [Op.in]: ['coordinador', 'tecnico'] } },
            group: ['empresa_id', 'rol'],
            raw: true,
        })) as unknown as Array<{ empresa_id: string; rol: string; total: string }>;

        for (const fila of filas) {
            const actual = conteos.get(fila.empresa_id) ?? { coordinadores: 0, tecnicos: 0 };
            if (fila.rol === 'coordinador') actual.coordinadores = Number(fila.total);
            if (fila.rol === 'tecnico') actual.tecnicos = Number(fila.total);
            conteos.set(fila.empresa_id, actual);
        }
        return conteos;
    }

    private armarResumen(empresa: Empresa, conteos: Conteos): EmpresaResumenDTO {
        const c = conteos.get(empresa.id) ?? { coordinadores: 0, tecnicos: 0 };
        const msPorDia = 24 * 60 * 60 * 1000;
        return {
            id: empresa.id,
            nombre: empresa.nombre,
            correo_contacto: empresa.correo_contacto,
            telefono: empresa.telefono,
            logo_url: empresa.logo_url ?? null,
            estado: empresa.estado,
            isActive: empresa.isActive,
            cantidad_coordinadores: c.coordinadores,
            cantidad_tecnicos: c.tecnicos,
            // TODO: cuando exista el módulo Suscripciones, devolver el nombre del plan real.
            tipo_suscripcion: empresa.trialExpiresAt ? 'Prueba gratuita' : null,
            fecha_registro: empresa.createdAt,
            dias_con_servicio: Math.floor((Date.now() - new Date(empresa.createdAt).getTime()) / msPorDia),
        };
    }
}
