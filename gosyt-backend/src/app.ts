import express from 'express';
import empresasRoutes from './modules/empresas/routes';
import { errorHandler } from './core/errors/errorHandler';

const app = express();

app.use(express.json());
app.use('/api/empresas', empresasRoutes);

app.use(errorHandler);

export default app;