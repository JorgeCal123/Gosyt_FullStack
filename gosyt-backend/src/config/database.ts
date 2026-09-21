import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import { env } from './env';

// --- Constante con la conexión a la base de datos de PostgreSQL usando (Sequelize) ---
export const sequelize = new Sequelize(
    env.db.name,
    env.db.user,
    env.db.password,
    {
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres',
        logging: env.nodeEnv === 'development' ? console.log : false,
    }
);

// --- Función para conectar a la base de datos de PostgreSQL ---
export async function connectPostgres(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL conectado correctamente.');
    } catch (error) {
        console.error('Error al conectar PostgreSQL:', error);
        process.exit(1);
    }
}

// --- Conexión MongoDB (Mongoose) ---
export async function connectMongo(): Promise<void> {
    try {
        await mongoose.connect(env.mongo.uri);
        console.log('MongoDB conectado correctamente.');
    } catch (error) {
        console.error('Error al conectar MongoDB:', error);
        process.exit(1);
    }
}