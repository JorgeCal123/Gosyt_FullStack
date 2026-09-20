import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Falta la variable de entorno: ${key}`);
    }
    return value;
}

export const env = {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',

    db: {
        host: required('DB_HOST'),
        port: Number(process.env.DB_PORT) || 5432,
        name: required('DB_NAME'),
        user: required('DB_USER'),
        password: required('DB_PASSWORD'),
    },

    mongo: {
        uri: required('MONGO_URI'),
    },

    jwt: {
        secret: required('JWT_SECRET'),
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
};