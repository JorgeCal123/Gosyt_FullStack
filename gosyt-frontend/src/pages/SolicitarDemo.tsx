import React from 'react';
import { SolicitudForm } from '../features/solicitudes/components/SolicitudForm/SolicitudForm';
import styles from './SolicitarDemo.module.css';

export const SolicitarDemo: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.brandHeader}>
        <span className={styles.brandBadge}>GoSYT Cloud</span>
        <h1 className={styles.title}>Comienza tu prueba gratuita hoy</h1>
      </div>
      <div className={styles.formContainer}>
        <SolicitudForm />
      </div>
    </div>
  );
};

export default SolicitarDemo;

