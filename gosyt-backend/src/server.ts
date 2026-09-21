import app from './app';
import { env } from './config/env';
import { connectPostgres, connectMongo, sequelize } from './config/database';

async function bootstrap() {
    await connectPostgres();
    await connectMongo();

    // sync() crea/actualiza tablas automáticamente en dev.
    // En producción, usa migraciones reales (sequelize-cli), no sync({ alter: true }).
    await sequelize.sync({ alter: env.nodeEnv === 'development' });

    app.listen(env.port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
    });
}

bootstrap();