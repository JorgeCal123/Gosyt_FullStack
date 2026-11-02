import express from 'express';
import empresasRoutes from './modules/empresas/empresa.routes';
import solicitudesRoutes from './modules/solicitudes/solicitudes.routes';
//import usuariosRoutes from './modules/usuarios/usuarios.routes';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './core/errors/errorHandler';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
//app.use('/api/usuarios', usuariosRoutes);

app.use(errorHandler);

export default app;