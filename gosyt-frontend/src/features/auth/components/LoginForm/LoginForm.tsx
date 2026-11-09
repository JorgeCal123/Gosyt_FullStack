import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../../../lib/apiClient';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { Alert } from '../../../../components/Alert/Alert';
import { ShieldIcon, KeyIcon } from '../../../../components/Icons';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPendingPassword, setIsPendingPassword] = useState(false);
  const [isPlanExpired, setIsPlanExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsPendingPassword(false);
    setIsPlanExpired(false);

    if (!correo.trim() || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      await login({ correo: correo.trim(), password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Error al iniciar sesión');
      setErrorMsg(message);

      if (message.toLowerCase().includes('creación de tu contraseña') || message.toLowerCase().includes('pendiente_creacion')) {
        setIsPendingPassword(true);
      } else if (message.toLowerCase().includes('plan de tu empresa se encuentra vencido')) {
        setIsPlanExpired(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredential = (roleEmail: string, rolePass: string) => {
    setCorreo(roleEmail);
    setPassword(rolePass);
    setErrorMsg(null);
    setIsPendingPassword(false);
    setIsPlanExpired(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <ShieldIcon size={28} />
        </div>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        <p className={styles.subtitle}>Ingresa tus credenciales para acceder a GoSYT</p>
      </div>

      {errorMsg && (
        <Alert
          variant={isPlanExpired ? 'warning' : 'error'}
          title={isPlanExpired ? 'Suscripción Vencida' : 'Acceso Denegado'}
          className={styles.alert}
        >
          {errorMsg}
          {isPendingPassword && (
            <div className={styles.actionPrompt}>
              <Link to="/activar-cuenta" className={styles.activateLink}>
                <KeyIcon size={16} />
                Ir a Crear / Activar Contraseña
              </Link>
            </div>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="ejemplo@gosyt.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
          Entrar a la Plataforma
        </Button>
      </form>

      {/* Accesos rápidos de desarrollo para probar roles */}
      <div className={styles.quickRoles}>
        <span className={styles.quickRolesTitle}>Credenciales de prueba:</span>
        <div className={styles.roleChips}>
          <button
            type="button"
            className={styles.roleChip}
            onClick={() => fillQuickCredential('owner@gosyt.com', '1234')}
          >
            Owner GoSYT
          </button>
          <button
            type="button"
            className={styles.roleChip}
            onClick={() => fillQuickCredential('adminempresa@gmail.com', 'user1234')}
          >
            Admin Empresa
          </button>
          <button
            type="button"
            className={styles.roleChip}
            onClick={() => fillQuickCredential('coordinador@gmail.com', 'user1234')}
          >
            Coordinador
          </button>
          <button
            type="button"
            className={styles.roleChip}
            onClick={() => fillQuickCredential('tecnico@gmail.com', 'user1234')}
          >
            Técnico
          </button>
        </div>
      </div>

      <div className={styles.footerHelp}>
        <div className={styles.trialPromo}>
          <span>¿No tienes una cuenta?</span>
          <Link to="/solicitar-demo" className={styles.solicitarLink}>
            Solicitar prueba gratuita de 30 días
          </Link>
        </div>
        <div className={styles.tokenHelp}>
          <span>¿Ya tienes un token de activación?</span>
          <Link to="/activar-cuenta" className={styles.tokenLink}>
            Activar cuenta / Cambiar contraseña
          </Link>
        </div>
      </div>
    </div>
  );
};

