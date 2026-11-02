import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { Empresa } from '../empresas/empresa.model';

interface UsuarioAttributes {
    id: string;
    nombre: string;
    apellido: string;
    cedula?: string;
    tipo_documento?: string;
    correo: string;
    telefono: string;
    password_hash: string;
    rol: string;
    estado_habilitacion: string;
    estado_credenciales: string;
    avatar_url?: string | null;
    avatarPublicId?: string | null;
    token_seguridad?: string | null;
    token_expiracion?: Date | null;
    mustChangePassword: boolean;
    empresa_id?: string | null; // NULL permitido solo para 'owner_gosyt'
}

type UsuarioCreationAttributes = Optional<
    UsuarioAttributes,
    | 'id'
    | 'cedula'
    | 'tipo_documento'
    | 'avatar_url'
    | 'avatarPublicId'
    | 'token_seguridad'
    | 'token_expiracion'
    | 'mustChangePassword'
    | 'empresa_id'
>;

export class Usuario
    extends Model<UsuarioAttributes, UsuarioCreationAttributes>
    implements UsuarioAttributes {
    // id:identificador unico de cada usuario
    public id!: string;

    // nombre:nombre del usuario
    public nombre!: string;

    // apellido:apellido del usuario
    public apellido!: string;

    // cedula:cedula del usuario
    public cedula!: string;

    // tipo_documento:tipo de documento del usuario
    public tipo_documento!: string;

    // correo:correo electronico del usuario
    public correo!: string;

    // telefono:telefono del usuario
    public telefono!: string;

    // password_hash:contraseña hasheada del usuario
    public password_hash!: string;

    // rol:rol del usuario puede ser 
    // owner_gosyt (dueño de la app), 
    // admin_empresa (administrador de la empresa), 
    // coordinador (coordinador de la empresa), 
    // tecnico (tecnico de la empresa)
    public rol!: string;

    // estado_habilitacion: El usuario puede estar 
    // Activo o Inactivo dentro de la aplicacion
    public estado_habilitacion!: string;

    // estado_credenciales: Estado del usuario si su contraseña ha sido creada o no puede ser
    // PENDIENTE_CREACION o CONTRASEÑA_CREADA
    public estado_credenciales!: string;

    // avatar_url:url de la imagen del usuario
    public avatar_url!: string | null;

    // avatarPublicId:identificador unico de la imagen del usuario
    public avatarPublicId!: string | null;

    // token_seguridad:token de seguridad del usuario
    public token_seguridad!: string | null;

    // token_expiracion:fecha de expiracion del token de seguridad del usuario
    public token_expiracion!: Date | null;

    // mustChangePassword:si el usuario debe cambiar su contraseña
    public mustChangePassword!: boolean;

    // empresa_id:identificador unico de la empresa a la que pertenece el usuario
    public empresa_id!: string | null;

    // createdAt:fecha de creacion del usuario
    public readonly createdAt!: Date;

    // updatedAt:fecha de actualizacion del usuario
    public readonly updatedAt!: Date;
}

Usuario.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: { type: DataTypes.STRING, allowNull: false },
        apellido: { type: DataTypes.STRING, allowNull: false },
        cedula: { type: DataTypes.STRING, allowNull: false },
        tipo_documento: { type: DataTypes.STRING, allowNull: false },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        telefono: { type: DataTypes.STRING, allowNull: false },
        password_hash: { type: DataTypes.STRING, allowNull: false },
        rol: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['owner_gosyt', 'admin_empresa', 'coordinador', 'tecnico']],
            },
        },
        estado_habilitacion: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Activo',
            validate: { isIn: [['Activo', 'Inactivo']] },
        },
        estado_credenciales: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'PENDIENTE_CREACION',
            validate: {
                isIn: [['PENDIENTE_CREACION', 'CONTRASEÑA_CREADA']],
            },
        },
        avatar_url: { type: DataTypes.STRING, allowNull: true },
        avatarPublicId: { type: DataTypes.STRING, allowNull: true },
        token_seguridad: { type: DataTypes.STRING, allowNull: true },
        token_expiracion: { type: DataTypes.DATE, allowNull: true },
        mustChangePassword: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        empresa_id: {
            type: DataTypes.UUID,
            allowNull: true, // NULL solo válido para owner_gosyt (se valida en el service)
            references: {
                model: Empresa,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        timestamps: true,
    }
);

// --- Asociaciones ---
Empresa.hasMany(Usuario, { foreignKey: 'empresa_id', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });