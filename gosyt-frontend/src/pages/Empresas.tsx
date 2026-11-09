import React from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { Layout } from '../components/Layout/Layout';
import { EmpresasResumenList } from '../features/empresas/components/EmpresasResumenList/EmpresasResumenList';
import { MiEmpresaView } from '../features/empresas/components/MiEmpresaView/MiEmpresaView';

export const Empresas: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Layout user={user} onLogout={logout}>
      {user?.rol === 'owner_gosyt' ? <EmpresasResumenList /> : <MiEmpresaView />}
    </Layout>
  );
};

export default Empresas;

