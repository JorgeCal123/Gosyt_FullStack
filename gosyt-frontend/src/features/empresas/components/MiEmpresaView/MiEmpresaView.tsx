import React, { useState, useEffect, useCallback } from 'react';
import styles from './MiEmpresaView.module.css';
import { empresasService } from '../../services/empresas.service';
import type { Empresa } from '../../types';
import { getApiErrorMessage } from '../../../../lib/apiClient';
import { Card } from '../../../../components/Card/Card';
import { Badge } from '../../../../components/Badge/Badge';
import { Button } from '../../../../components/Button/Button';
import { Alert } from '../../../../components/Alert/Alert';
import { BuildingIcon, ShieldIcon, RefreshIcon, CheckCircleIcon } from '../../../../components/Icons';

export const MiEmpresaView: React.FC = () => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMiEmpresa = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await empresasService.getMiEmpresa();
      setEmpresa(data);
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Error al cargar los datos de la empresa'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMiEmpresa();
  }, [fetchMiEmpresa]);

  const calculateTrialStatus = (trialExpiresAt?: string | null) => {
    if (!trialExpiresAt) {
      return { isTrial: false, isExpired: false, text: 'Plan Comercial o Sin Límite de Prueba' };
    }
    const expires = new Date(trialExpiresAt);
    const now = new Date();
    const diffMs = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs <= 0) {
      return { isTrial: true, isExpired: true, text: 'Prueba Gratuita Vencida' };
    }
    return {
      isTrial: true,
      isExpired: false,
      text: `Prueba Gratuita (${diffDays} ${diffDays === 1 ? 'día restante' : 'días restantes'})`,
    };
  };

  if (loading) {
    return (
      <Card className={styles.loadingCard}>
        <div className={styles.spinner} />
        <p>Cargando información de tu empresa...</p>
      </Card>
    );
  }

  if (errorMsg) {
    return (
      <Card className={styles.errorCard}>
        <Alert variant="error" title="No se pudo cargar la empresa">
          {errorMsg}
        </Alert>
        <Button variant="secondary" onClick={fetchMiEmpresa} className={styles.retryBtn}>
          Reintentar
        </Button>
      </Card>
    );
  }

  if (!empresa) return null;

  const trialInfo = calculateTrialStatus(empresa.trialExpiresAt);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.title}>Mi Empresa</h2>
          <p className={styles.subtitle}>Información corporativa y estado de servicio contratado</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={fetchMiEmpresa}
          leftIcon={<RefreshIcon size={16} />}
        >
          Actualizar
        </Button>
      </div>

      {trialInfo.isExpired && (
        <Alert
          variant="warning"
          title="Periodo de Prueba Vencido"
          className={styles.alertSpacing}
        >
          El periodo de prueba de tu empresa ha finalizado. Como <strong>admin_empresa</strong> puedes
          seguir ingresando para gestionar tu suscripción y actualizar datos. Los roles de
          coordinador y técnico no podrán iniciar sesión hasta que se restablezca el plan.
        </Alert>
      )}

      <Card className={styles.mainCard}>
        <div className={styles.headerRow}>
          <div className={styles.companyIdentity}>
            <div className={styles.avatarBox}>
              <BuildingIcon size={32} />
            </div>
            <div>
              <h3 className={styles.empresaName}>{empresa.nombre}</h3>
              <span className={styles.empresaId}>Identificador único: {empresa.id}</span>
            </div>
          </div>

          <div className={styles.badgesCluster}>
            <Badge variant={empresa.estado === 'Activa' ? 'success' : 'danger'} size="md">
              {empresa.estado}
            </Badge>
            <Badge variant={trialInfo.isExpired ? 'danger' : 'primary'} size="md">
              {trialInfo.text}
            </Badge>
          </div>
        </div>

        <div className={styles.gridData}>
          <div className={styles.dataBox}>
            <span className={styles.dataLabel}>Correo Electrónico de Contacto</span>
            <span className={styles.dataValue}>{empresa.correo_contacto}</span>
          </div>

          <div className={styles.dataBox}>
            <span className={styles.dataLabel}>Teléfono Principal</span>
            <span className={styles.dataValue}>{empresa.telefono}</span>
          </div>

          <div className={styles.dataBox}>
            <span className={styles.dataLabel}>Fecha de Vencimiento de Prueba</span>
            <span className={styles.dataValue}>
              {empresa.trialExpiresAt
                ? new Date(empresa.trialExpiresAt).toLocaleDateString()
                : 'No aplica'}
            </span>
          </div>

          <div className={styles.dataBox}>
            <span className={styles.dataLabel}>Fecha de Afiliación</span>
            <span className={styles.dataValue}>
              {empresa.createdAt ? new Date(empresa.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Notificación de Permisos Heredados de Coordinador */}
        <div className={styles.roleCard}>
          <div className={styles.roleCardHeader}>
            <ShieldIcon size={20} className={styles.shieldIcon} />
            <div>
              <h4 className={styles.roleCardTitle}>Rol: Administrador de Empresa</h4>
              <p className={styles.roleCardSub}>
                Heredas automáticamente todas las capacidades operativas de Coordinador
              </p>
            </div>
          </div>
          <ul className={styles.privilegesList}>
            <li>
              <CheckCircleIcon size={16} />
              <span>Acceso total a la consulta y actualización de la empresa.</span>
            </li>
            <li>
              <CheckCircleIcon size={16} />
              <span>
                Acceso prioritario que nunca te bloquea el inicio de sesión ante un plan vencido.
              </span>
            </li>
            <li>
              <CheckCircleIcon size={16} />
              <span>
                Facultad para coordinar personal (coordinadores y técnicos) dentro de tu empresa.
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
