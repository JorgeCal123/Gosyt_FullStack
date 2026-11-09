import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styles from './ActivateForm.module.css';
import { authService } from '../../services/auth.service';
import { getApiErrorMessage } from '../../../../lib/apiClient';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { Alert } from '../../../../components/Alert/Alert';
import { Badge } from '../../../../components/Badge/Badge';
import { KeyIcon, CheckCircleIcon, EyeIcon, EyeOffIcon, BuildingIcon } from '../../../../components/Icons';

export interface CompanyPreviewData {
  nombre?: string;
  correo_contacto?: string;
  telefono?: string;
  estado?: string;
}

interface ActivateFormProps {
  initialCompanyData?: CompanyPreviewData;
}

export const ActivateForm: React.FC<ActivateFormProps> = ({ initialCompanyData }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Datos informativos de la empresa (solo lectura según especificación)
  const [companyInfo] = useState<CompanyPreviewData>(() => ({
    nombre: searchParams.get('empresa') || initialCompanyData?.nombre || 'Empresa Registrada',
    correo_contacto: searchParams.get('correo') || initialCompanyData?.correo_contacto || 'contacto@empresa.com',
    telefono: searchParams.get('telefono') || initialCompanyData?.telefono || '3000000000',
    estado: 'Prueba Gratuita Activa',
  }));

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!token.trim()) {
      setErrorMsg('El token de activación es obligatorio.');
      return;
    }

    if (nuevaPassword.length < 8) {
      setErrorMsg('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.activate({
        token_activacion: token.trim(),
        nueva_password: nuevaPassword,
        confirmar_password: confirmarPassword,
      });
      setSuccessMsg(response.message || 'Contraseña creada exitosamente. Ya puedes iniciar sesión.');
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Error al activar la cuenta'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <KeyIcon size={28} />
        </div>
        <h2 className={styles.title}>Activar Cuenta de Administrador</h2>
        <p className={styles.subtitle}>
          Completa la creación de tu contraseña para acceder a la administración de tu empresa.
        </p>
      </div>

      {/* Sección de Datos de la Empresa (Solo Lectura) */}
      <div className={styles.companyCard}>
        <div className={styles.companyHeader}>
          <div className={styles.companyHeaderTitle}>
            <BuildingIcon size={18} />
            <span>Datos de la Empresa</span>
          </div>
          <Badge variant="warning" size="sm">Solo lectura</Badge>
        </div>
        <div className={styles.companyGrid}>
          <div className={styles.companyField}>
            <span className={styles.fieldLabel}>Nombre Comercial</span>
            <span className={styles.fieldValue}>{companyInfo.nombre}</span>
          </div>
          <div className={styles.companyField}>
            <span className={styles.fieldLabel}>Correo de Contacto</span>
            <span className={styles.fieldValue}>{companyInfo.correo_contacto}</span>
          </div>
          <div className={styles.companyField}>
            <span className={styles.fieldLabel}>Teléfono</span>
            <span className={styles.fieldValue}>{companyInfo.telefono}</span>
          </div>
          <div className={styles.companyField}>
            <span className={styles.fieldLabel}>Estado Inicial</span>
            <Badge variant="success" size="sm">{companyInfo.estado}</Badge>
          </div>
        </div>
      </div>

      {errorMsg && (
        <Alert variant="error" title="Error de Activación" className={styles.alert}>
          {errorMsg}
        </Alert>
      )}

      {successMsg ? (
        <div className={styles.successState}>
          <Alert variant="success" title="¡Cuenta Activada!">
            {successMsg}
          </Alert>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
            leftIcon={<CheckCircleIcon size={18} />}
          >
            Ir a Iniciar Sesión
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Token de Activación"
            type="text"
            placeholder="Pega el token recibido aquí"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            helperText="Token de 64 caracteres generado al aceptar tu solicitud"
          />

          <Input
            label="Nueva Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeBtn}
                aria-label="Ver u ocultar contraseña"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            }
          />

          <Input
            label="Confirmar Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repite la contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
            error={
              confirmarPassword && nuevaPassword !== confirmarPassword
                ? 'Las contraseñas no coinciden'
                : undefined
            }
          />

          <div className={styles.rules}>
            <span className={styles.rulesTitle}>Requisitos de seguridad:</span>
            <ul className={styles.rulesList}>
              <li className={nuevaPassword.length >= 8 ? styles.ruleValid : ''}>
                Mínimo 8 caracteres
              </li>
              <li
                className={
                  nuevaPassword && nuevaPassword === confirmarPassword ? styles.ruleValid : ''
                }
              >
                Las contraseñas deben ser idénticas
              </li>
            </ul>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
            Establecer Contraseña y Activar
          </Button>

          <div className={styles.backLinkWrapper}>
            <Link to="/login" className={styles.backLink}>
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

