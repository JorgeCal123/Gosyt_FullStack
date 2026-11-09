import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SolicitudForm.module.css';
import { solicitudesService } from '../../services/solicitudes.service';
import type { CreateSolicitudDTO } from '../../types';
import { getApiErrorMessage } from '../../../../lib/apiClient';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import { Alert } from '../../../../components/Alert/Alert';
import { BuildingIcon, CheckCircleIcon } from '../../../../components/Icons';

export const SolicitudForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateSolicitudDTO>({
    nombre_empresa: '',
    nombre_solicitante: '',
    apellido_solicitante: '',
    correo: '',
    telefono: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (field: keyof CreateSolicitudDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validaciones básicas
    if (
      !formData.nombre_empresa.trim() ||
      !formData.nombre_solicitante.trim() ||
      !formData.apellido_solicitante.trim() ||
      !formData.correo.trim() ||
      !formData.telefono.trim()
    ) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const response = await solicitudesService.crear(formData);
      setSuccessMsg(
        response.message || '¡Solicitud enviada con éxito! El equipo de GoSYT la revisará a la brevedad.'
      );
      setFormData({
        nombre_empresa: '',
        nombre_solicitante: '',
        apellido_solicitante: '',
        correo: '',
        telefono: '',
      });
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Error al registrar la solicitud'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <BuildingIcon size={28} />
        </div>
        <h2 className={styles.title}>Solicita tu Prueba Gratuita</h2>
        <p className={styles.subtitle}>
          Experimenta todas las capacidades de GoSYT durante 30 días sin costo ni compromiso.
        </p>
      </div>

      {errorMsg && (
        <Alert variant="error" title="No se pudo procesar la solicitud" className={styles.alert}>
          {errorMsg}
        </Alert>
      )}

      {successMsg ? (
        <div className={styles.successState}>
          <Alert variant="success" title="¡Solicitud Recibida!">
            {successMsg}
          </Alert>
          <p className={styles.successHint}>
            Una vez que nuestro equipo apruebe tu solicitud, tu cuenta de administrador quedará
            creada y podrás establecer tu contraseña inicial.
          </p>
          <div className={styles.successActions}>
            <Link to="/login" className={styles.loginLink}>
              <Button variant="primary" fullWidth size="lg">
                Ir al Inicio de Sesión
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nombre de la Empresa"
            placeholder="Ej. Redes y Telecomunicaciones S.A.S"
            value={formData.nombre_empresa}
            onChange={(e) => handleChange('nombre_empresa', e.target.value)}
            required
          />

          <div className={styles.row}>
            <Input
              label="Nombre del Solicitante"
              placeholder="Ej. Carlos"
              value={formData.nombre_solicitante}
              onChange={(e) => handleChange('nombre_solicitante', e.target.value)}
              required
            />
            <Input
              label="Apellido del Solicitante"
              placeholder="Ej. Gómez"
              value={formData.apellido_solicitante}
              onChange={(e) => handleChange('apellido_solicitante', e.target.value)}
              required
            />
          </div>

          <Input
            label="Correo Corporativo"
            type="email"
            placeholder="administrador@empresa.com"
            value={formData.correo}
            onChange={(e) => handleChange('correo', e.target.value)}
            required
            helperText="Será el correo oficial del administrador de la empresa"
          />

          <Input
            label="Teléfono o Celular de Contacto"
            type="tel"
            placeholder="Ej. 3001234567"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            required
          />

          <div className={styles.benefits}>
            <span className={styles.benefitsTitle}>Beneficios incluidos:</span>
            <ul className={styles.benefitsList}>
              <li>
                <CheckCircleIcon size={14} />
                Acceso completo para coordinadores y técnicos
              </li>
              <li>
                <CheckCircleIcon size={14} />
                Aislamiento y seguridad multi-tenant de datos
              </li>
              <li>
                <CheckCircleIcon size={14} />
                Prueba gratuita por 30 días sin tarjetas de crédito
              </li>
            </ul>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
            Enviar Solicitud de Registro
          </Button>

          <div className={styles.footerHelp}>
            <span>¿Ya tienes cuenta o solicitud aprobada?</span>
            <div className={styles.helpLinks}>
              <Link to="/login" className={styles.link}>
                Iniciar Sesión
              </Link>
              <span>•</span>
              <Link to="/activar-cuenta" className={styles.link}>
                Activar con Token
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

