import express from 'express';
import empresasRoutes from './modules/empresas/empresa.routes';
import usuariosRoutes from './modules/usuarios/usuarios.routes';

import { errorHandler } from './core/errors/errorHandler';

const app = express();

app.use(express.json());
app.use('/api/empresas', empresasRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.use(errorHandler);

export default app;