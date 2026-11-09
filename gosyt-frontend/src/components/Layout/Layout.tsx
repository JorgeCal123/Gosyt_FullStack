import React from 'react';
import styles from './Layout.module.css';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { LogOutIcon, ShieldIcon } from '../Icons';

export interface LayoutProps {
  user?: {
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  } | null;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const getRoleBadgeVariant = (rol?: string) => {
    switch (rol) {
      case 'owner_gosyt':
        return 'danger';
      case 'admin_empresa':
        return 'primary';
      case 'coordinador':
        return 'info';
      case 'tecnico':
        return 'success';
      default:
        return 'neutral';
    }
  };

  const getRoleLabel = (rol?: string) => {
    switch (rol) {
      case 'owner_gosyt':
        return 'Owner GoSYT';
      case 'admin_empresa':
        return 'Admin Empresa';
      case 'coordinador':
        return 'Coordinador';
      case 'tecnico':
        return 'Técnico';
      default:
        return rol || 'Usuario';
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logoBadge}>
              <ShieldIcon size={22} className={styles.logoIcon} />
            </div>
            <div>
              <span className={styles.brandName}>GoSYT</span>
              <span className={styles.brandSub}>Plataforma de Gestión</span>
            </div>
          </div>

          {user && (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <div className={styles.userMeta}>
                  <span className={styles.userName}>
                    {user.nombre} {user.apellido}
                  </span>
                  <span className={styles.userEmail}>{user.correo}</span>
                </div>
                <Badge variant={getRoleBadgeVariant(user.rol)} size="sm">
                  {getRoleLabel(user.rol)}
                </Badge>
              </div>

              {onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  leftIcon={<LogOutIcon size={16} />}
                >
                  Cerrar Sesión
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
};
