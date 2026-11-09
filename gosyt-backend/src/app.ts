import express from 'express';
import empresasRoutes from './modules/empresas/empresa.routes';
import solicitudesRoutes from './modules/solicitudes/solicitudes.routes';
//import usuariosRoutes from './modules/usuarios/usuarios.routes';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './core/errors/errorHandler';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
//app.use('/api/usuarios', usuariosRoutes);

app.use(errorHandler);

export default app;