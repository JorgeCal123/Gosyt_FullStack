import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';

export const ESTADOS_SOLICITUD = ['Pendiente', 'Aceptada', 'Rechazada'] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

export interface ISolicitud {
  _id: string;
  nombre_empresa: string;
  nombre_solicitante: string;
  apellido_solicitante: string;
  correo: string;
  telefono: string;
  estado: EstadoSolicitud;
  createdAt?: Date;
  updatedAt?: Date;
}

const solicitudSchema = new Schema<ISolicitud>(
  {
    _id: { type: String, default: () => randomUUID() },
    nombre_empresa: { type: String, required: true, trim: true },
    nombre_solicitante: { type: String, required: true, trim: true },
    apellido_solicitante: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, lowercase: true },
    telefono: { type: String, required: true, trim: true },
    estado: { type: String, enum: ESTADOS_SOLICITUD, default: 'Pendiente' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Solicitud = model<ISolicitud>('Solicitud', solicitudSchema, 'solicitudes_prueba');
