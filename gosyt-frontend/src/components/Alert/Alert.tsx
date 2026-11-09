import React from 'react';
import styles from './Alert.module.css';
import { AlertCircleIcon, CheckCircleIcon, XIcon } from '../Icons';

export interface AlertProps {
  variant?: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const renderIcon = () => {
    switch (variant) {
      case 'error':
        return <AlertCircleIcon size={20} className={styles.icon} />;
      case 'warning':
        return <AlertCircleIcon size={20} className={styles.icon} />;
      case 'success':
        return <CheckCircleIcon size={20} className={styles.icon} />;
      case 'info':
      default:
        return <AlertCircleIcon size={20} className={styles.icon} />;
    }
  };

  return (
    <div className={`${styles.alert} ${styles[variant]} ${className}`} role="alert">
      <div className={styles.iconWrapper}>{renderIcon()}</div>
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.message}>{children}</div>
      </div>
      {onClose && (
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
};

