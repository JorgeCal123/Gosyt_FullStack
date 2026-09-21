import { Usuario } from './usuarios.model';
import { CreateUsuarioDTO, UpdateUsuarioDTO } from './usuarios.dto';
import { AppError } from '../../core/errors/AppError';
import { hashPassword } from '../../core/utils/hash';

export class UsuarioService {
    async create(data: CreateUsuarioDTO) {
        const existe = await Usuario.findOne({ where: { correo: data.correo } });
        if (existe) throw new AppError('Ya existe un usuario con ese correo', 409);

        // Regla de negocio: solo owner_gosyt puede no tener empresa
        if (data.rol !== 'owner_gosyt' && !data.empresa_id) {
            throw new AppError('empresa_id es obligatorio para este rol', 400);
        }

        const password_hash = await hashPassword(data.password);

        return Usuario.create({
            ...data,
            password_hash,
            estado_habilitacion: 'Activo',
            estado_credenciales: 'PENDIENTE_CREACION',
        });
    }

    async findAll() {
        return Usuario.findAll({
            attributes: { exclude: ['password_hash'] }, // nunca exponer el hash
            include: [{ association: 'empresa' }],
        });
    }

    async findById(id: string) {
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['password_hash'] },
            include: [{ association: 'empresa' }],
        });
        if (!usuario) throw new AppError('Usuario no encontrado', 404);
        return usuario;
    }

    async update(id: string, data: UpdateUsuarioDTO) {
        const usuario = await this.findById(id);
        return usuario.update(data);
    }

    async delete(id: string) {
        const usuario = await this.findById(id);
        await usuario.destroy();
        return { message: 'Usuario eliminado' };
    }
}