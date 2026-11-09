import React from 'react';
import styles from './UserProfileCard.module.css';
import type { Usuario } from '../../types';
import { Badge } from '../../../../components/Badge/Badge';
import { Card } from '../../../../components/Card/Card';
import { UserIcon, BuildingIcon, ShieldIcon, CheckCircleIcon } from '../../../../components/Icons';

interface UserProfileCardProps {
  usuario: Usuario;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ usuario }) => {
  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'owner_gosyt':
        return 'Owner GoSYT (Superadministrador)';
      case 'admin_empresa':
        return 'Administrador de Empresa';
      case 'coordinador':
        return 'Coordinador de Operaciones';
      case 'tecnico':
        return 'Técnico de Campo';
      default:
        return rol;
    }
  };

  const getRoleDescription = (rol: string) => {
    switch (rol) {
      case 'owner_gosyt':
        return 'Tienes acceso total para revisar solicitudes, ver resúmenes generales de empresas y gestionar la plataforma sin límite de suscripción.';
      case 'admin_empresa':
        return 'Administras la información y personal de tu empresa. Puedes acceder aún si el plan se encuentra vencido para renovaciones.';
      case 'coordinador':
        return 'Gestionas tareas operativas y asignaciones. Tu acceso requiere que el plan de tu empresa permanezca activo.';
      case 'tecnico':
        return 'Ejecutas tareas asignadas en campo. Tu acceso requiere que el plan de tu empresa permanezca activo.';
      default:
        return '';
    }
  };

  const getRoleVariant = (rol: string) => {
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

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : <UserIcon size={32} />}
        </div>
        <div className={styles.headerMeta}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>
              {usuario.nombre} {usuario.apellido}
            </h2>
            <Badge variant={getRoleVariant(usuario.rol)} size="md">
              {getRoleLabel(usuario.rol)}
            </Badge>
          </div>
          <span className={styles.email}>{usuario.correo}</span>
        </div>
      </div>

      <div className={styles.roleNotice}>
        <ShieldIcon size={20} className={styles.noticeIcon} />
        <p className={styles.noticeText}>{getRoleDescription(usuario.rol)}</p>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Teléfono de Contacto</span>
          <span className={styles.detailValue}>{usuario.telefono || 'No registrado'}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Documento de Identidad</span>
          <span className={styles.detailValue}>
            {usuario.tipo_documento ? `${usuario.tipo_documento} ` : ''}
            {usuario.cedula || 'No registrada'}
          </span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Estado de Habilitación</span>
          <div>
            <Badge variant={usuario.estado_habilitacion === 'Activo' ? 'success' : 'danger'}>
              {usuario.estado_habilitacion}
            </Badge>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Estado de Credenciales</span>
          <div>
            <Badge
              variant={
                usuario.estado_credenciales === 'CONTRASEÑA_CREADA' ? 'success' : 'warning'
              }
            >
              {usuario.estado_credenciales}
            </Badge>
          </div>
        </div>

        {usuario.empresa && (
          <div className={`${styles.detailItem} ${styles.fullRow}`}>
            <span className={styles.detailLabel}>Empresa Asociada</span>
            <div className={styles.empresaValue}>
              <BuildingIcon size={16} />
              <span>{usuario.empresa.nombre}</span>
              <Badge variant="primary" size="sm">
                {usuario.empresa.estado}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footerInfo}>
        <CheckCircleIcon size={16} className={styles.checkIcon} />
        <span>Sesión validada y autenticada mediante JWT de GoSYT</span>
      </div>
    </Card>
  );
};
