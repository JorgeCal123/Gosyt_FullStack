import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { LoginForm } from '../features/auth/components/LoginForm/LoginForm';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.brandContainer}>
        <div className={styles.brandBadge}>GoSYT</div>
        <h1 className={styles.mainTitle}>Sistema Integral de Gestión</h1>
        <p className={styles.tagline}>
          Plataforma multi-tenant de monitoreo, coordinación técnica y administración de servicios.
        </p>
      </div>

      <div className={styles.formContainer}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

