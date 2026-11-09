import React, { useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { Layout } from '../components/Layout/Layout';
import { SolicitudesList } from '../features/solicitudes/components/SolicitudesList/SolicitudesList';
import { EmpresasResumenList } from '../features/empresas/components/EmpresasResumenList/EmpresasResumenList';
import { MiEmpresaView } from '../features/empresas/components/MiEmpresaView/MiEmpresaView';
import { UserProfileCard } from '../features/usuarios/components/UserProfileCard/UserProfileCard';
import { Alert } from '../components/Alert/Alert';
import { BuildingIcon, UserIcon, CheckCircleIcon, ShieldIcon } from '../components/Icons';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Tab activo por defecto según el rol del usuario
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (user?.rol === 'owner_gosyt') return 'solicitudes';
    if (user?.rol === 'admin_empresa') return 'mi-empresa';
    return 'perfil';
  });

  if (!user) return null;

  return (
    <Layout user={user} onLogout={logout}>
      <div className={styles.dashboardContainer}>
        {/* Pestañas de navegación según el rol */}
        <div className={styles.navigationTabs}>
          {user.rol === 'owner_gosyt' && (
            <>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'solicitudes' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('solicitudes')}
              >
                <CheckCircleIcon size={18} />
                <span>Solicitudes de Prueba</span>
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'empresas' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('empresas')}
              >
                <BuildingIcon size={18} />
                <span>Empresas Clientes</span>
              </button>
            </>
          )}

          {user.rol === 'admin_empresa' && (
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'mi-empresa' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('mi-empresa')}
            >
              <BuildingIcon size={18} />
              <span>Mi Empresa</span>
            </button>
          )}

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'perfil' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            <UserIcon size={18} />
            <span>Mi Perfil</span>
          </button>
        </div>

        {/* Mensaje de bienvenida contextual */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeText}>
            <h1 className={styles.welcomeTitle}>
              Bienvenido, {user.nombre} {user.apellido}
            </h1>
            <p className={styles.welcomeSubtitle}>
              {user.rol === 'owner_gosyt' &&
                'Panel del Superadministrador de la plataforma GoSYT. Gestión centralizada de solicitudes y empresas.'}
              {user.rol === 'admin_empresa' &&
                'Panel del Administrador de Empresa. Consulta los datos de tu empresa y tus privilegios.'}
              {user.rol === 'coordinador' &&
                'Panel del Coordinador de Operaciones. Tu acceso requiere plan activo en tu empresa.'}
              {user.rol === 'tecnico' &&
                'Panel del Técnico de Campo. Tu acceso requiere plan activo en tu empresa.'}
            </p>
          </div>
        </div>

        {/* Notificaciones adicionales para roles operativos */}
        {(user.rol === 'coordinador' || user.rol === 'tecnico') && (
          <Alert variant="info" title="Suscripción Empresarial Activa" className={styles.roleAlert}>
            <div className={styles.roleAlertContent}>
              <ShieldIcon size={18} />
              <span>
                Has iniciado sesión exitosamente porque el plan de tu empresa se encuentra vigente y
                activo. En caso de vencimiento del plan, solo el administrador podrá ingresar para
                renovarlo.
              </span>
            </div>
          </Alert>
        )}

        {/* Renderizado del contenido según la pestaña seleccionada */}
        <div className={styles.tabContent}>
          {user.rol === 'owner_gosyt' && activeTab === 'solicitudes' && <SolicitudesList />}

          {user.rol === 'owner_gosyt' && activeTab === 'empresas' && <EmpresasResumenList />}

          {user.rol === 'admin_empresa' && activeTab === 'mi-empresa' && <MiEmpresaView />}

          {activeTab === 'perfil' && <UserProfileCard usuario={user} />}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

