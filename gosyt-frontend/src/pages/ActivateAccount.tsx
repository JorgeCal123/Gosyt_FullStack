import React from 'react';
import { ActivateForm } from '../features/auth/components/ActivateForm/ActivateForm';
import styles from './ActivateAccount.module.css';

export const ActivateAccount: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.brandHeader}>
        <span className={styles.brandBadge}>GoSYT Activación</span>
        <h1 className={styles.title}>Configuración Inicial de Administrador</h1>
      </div>
      <div className={styles.formContainer}>
        <ActivateForm />
      </div>
    </div>
  );
};

export default ActivateAccount;

