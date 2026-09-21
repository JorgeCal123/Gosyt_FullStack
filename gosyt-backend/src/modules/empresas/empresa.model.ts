import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

// --- Interfaz con los atributos de la tabla empresas ---

interface EmpresaAttributes {
    id: string;
    nombre: string;
    correo_contacto: string;
    telefono: string;
    logo_url?: string | null;
    estado: string;
    trialExpiresAt?: Date | null;
    isActive: boolean;
}
// Campos opcionales al crear (Sequelize los autogenera o tienen default)

type EmpresaCreationAttributes = Optional<EmpresaAttributes, 'id' | 'logo_url' | 'trialExpiresAt' | 'isActive'>;




// --- Clase que representa el modelo de empresas ---

export class Empresa extends Model<EmpresaAttributes, EmpresaCreationAttributes> implements EmpresaAttributes {

    public id!: string;
    public nombre!: string;
    public correo_contacto!: string;
    public telefono!: string;
    public logo_url!: string | null;
    public estado!: string;
    public trialExpiresAt!: Date | null;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// --- Inicialización del modelo Empresa ---
Empresa.init(
    {
        id: {
            //tipo de dato que genera un codigo unico tipo UUID 
            type: DataTypes.UUID,
            // valor por defecto (uuid) que se genera automaticamente
            defaultValue: DataTypes.UUIDV4,
            // clave primaria de la tabla empresas
            primaryKey: true,
        },
        nombre: {
            //tipo de dato string
            type: DataTypes.STRING,
            //no permite valores nulos
            allowNull: false,
        },
        correo_contacto: {
            //tipo de dato string
            type: DataTypes.STRING,
            //no permite valores nulos
            allowNull: false,
            //no permite valores duplicados
            unique: true,
            //valida que sea un correo electronico
            validate: { isEmail: true },
        },
        telefono: {
            //tipo de dato string
            type: DataTypes.STRING,
            //no permite valores nulos
            allowNull: false,
        },
        logo_url: {
            //tipo de dato string
            type: DataTypes.STRING,
            //permite valores nulos
            allowNull: true,
        },
        estado: {
            //tipo de dato string
            type: DataTypes.STRING,
            //no permite valores nulos
            allowNull: false,
            //valida que el valor sea 'Activa' o 'Inactiva'. Activo es cuando la empresa ha pagado la suscripcion o esta en la fase gratuita y tiene derecho a que sus usuarios puedan usar el sistema. Inactiva es cuando la empresa no ha pagado la suscripcion y no tiene derecho a que sus usuarios puedan usar el sistema o no esta en la fase gratuita de 30 dias y no puede usar el sistema
            validate: {
                isIn: [['Activa', 'Inactiva']],
            },
        },
        trialExpiresAt: {
            //tipo de dato fecha
            type: DataTypes.DATE,
            //permite valores nulos
            allowNull: true,
        },
        isActive: {
            //tipo de dato booleano
            type: DataTypes.BOOLEAN,
            //no permite valores nulos
            allowNull: false,
            //valor por defecto es true. true: La empresa existe y está activa en el sistema. false: La empresa fue dada de baja, eliminada o suspendida administrativamente por el superadministrador de la app. 
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'empresas',
        timestamps: true, // genera createdAt / updatedAt automáticamente
    }
);