import crypto from 'crypto';
import { Solicitud, ESTADOS_SOLICITUD, EstadoSolicitud } from './solicitudes.model';
import { CreateSolicitudDTO } from './solicitudes.dto';
import { Empresa } from '../empresas/empresa.model';
import { Usuario } from '../usuarios/usuarios.model';
import { sequelize } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../core/errors/AppError';
import { hashPassword } from '../../core/utils/hash';
import { generateActivationToken } from '../../core/utils/token';
import { isEmail } from '../../core/utils/validators';

const CAMPOS_OBLIGATORIOS = [
  'nombre_empresa',
  'nombre_solicitante',
  'apellido_solicitante',
  'correo',
  'telefono',
] as const;

export class SolicitudService {
  // Pública: cualquiera puede pedir la prueba. Se guarda SOLO en MongoDB.
  async crear(data: Partial<CreateSolicitudDTO>) {
    for (const campo of CAMPOS_OBLIGATORIOS) {
      if (!data[campo] || !String(data[campo]).trim()) {
        throw new AppError(`El campo ${campo} es obligatorio`, 400);
      }
    }

    const correo = data.correo!.trim().toLowerCase();
    if (!isEmail(correo)) throw new AppError('El formato del correo no es válido', 400);

    await this.verificarCorreoLibre(correo);

    const pendiente = await Solicitud.findOne({ correo, estado: 'Pendiente' });
    if (pendiente) throw new AppError('Ya existe una solicitud pendiente con ese correo', 409);

    return Solicitud.create({
      nombre_empresa: data.nombre_empresa!.trim(),
      nombre_solicitante: data.nombre_solicitante!.trim(),
      apellido_solicitante: data.apellido_solicitante!.trim(),
      correo,
      telefono: data.telefono!.trim(),
    });
  }

  async listar(estado?: string) {
    if (estado && !ESTADOS_SOLICITUD.includes(estado as EstadoSolicitud)) {
      throw new AppError('Estado de solicitud no válido', 400);
    }
    return Solicitud.find(estado ? { estado } : {}).sort({ createdAt: -1 });
  }

  // Aceptar: ahora SÍ se crean la empresa y el admin_empresa en PostgreSQL.
  async aceptar(id: string) {
    const solicitud = await Solicitud.findById(id);
    if (!solicitud) throw new AppError('Solicitud no encontrada', 404);
    if (solicitud.estado !== 'Pendiente') throw new AppError('La solicitud ya fue procesada', 409);

    await this.verificarCorreoLibre(solicitud.correo);

    const { token, tokenHash, expiresAt } = generateActivationToken();
    const trialExpiresAt = new Date(Date.now() + env.trialDays * 24 * 60 * 60 * 1000);
    // Contraseña aleatoria que nadie conoce: la real la crea el usuario con su enlace
    const passwordTemporal = await hashPassword(crypto.randomBytes(32).toString('hex'));

    // Empresa y usuario se crean juntos: si uno falla, no se guarda ninguno
    const { empresa, admin } = await sequelize.transaction(async (t) => {
      const empresa = await Empresa.create(
        {
          nombre: solicitud.nombre_empresa,
          correo_contacto: solicitud.correo,
          telefono: solicitud.telefono,
          estado: 'Activa',
          isActive: true,
          trialExpiresAt,
        },
        { transaction: t }
      );

      const admin = await Usuario.create(
        {
          nombre: solicitud.nombre_solicitante,
          apellido: solicitud.apellido_solicitante,
          correo: solicitud.correo,
          telefono: solicitud.telefono,
          password_hash: passwordTemporal,
          rol: 'admin_empresa',
          estado_habilitacion: 'Activo',
          estado_credenciales: 'PENDIENTE_CREACION',
          token_seguridad: tokenHash,
          token_expiracion: expiresAt,
          empresa_id: empresa.id,
        },
        { transaction: t }
      );

      return { empresa, admin };
    });

    // Mongo y Postgres no comparten transacción: esto va al final, ya con todo guardado
    solicitud.estado = 'Aceptada';
    await solicitud.save();

    const { password_hash, token_seguridad, token_expiracion, ...adminSeguro } = admin.toJSON();
    return { empresa, admin: adminSeguro, token_activacion: token };
  }

  // Rechazar: la solicitud se elimina de MongoDB y no queda rastro en PostgreSQL.
  async rechazar(id: string) {
    const solicitud = await Solicitud.findById(id);
    if (!solicitud) throw new AppError('Solicitud no encontrada', 404);
    if (solicitud.estado !== 'Pendiente') throw new AppError('La solicitud ya fue procesada', 409);

    await solicitud.deleteOne();
    return { message: 'Solicitud rechazada y eliminada' };
  }

  private async verificarCorreoLibre(correo: string) {
    const empresa = await Empresa.findOne({ where: { correo_contacto: correo } });
    const usuario = await Usuario.findOne({ where: { correo } });
    if (empresa || usuario) {
      throw new AppError('Ya existe una cuenta registrada con ese correo', 409);
    }
  }
}
