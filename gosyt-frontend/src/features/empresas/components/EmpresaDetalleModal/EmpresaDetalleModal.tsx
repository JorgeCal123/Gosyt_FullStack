import React, { useState, useEffect } from 'react';
import styles from './EmpresaDetalleModal.module.css';
import { empresasService } from '../../services/empresas.service';
import type { EmpresaResumenDTO } from '../../types';
import { getApiErrorMessage } from '../../../../lib/apiClient';
import { Modal } from '../../../../components/Modal/Modal';
import { Button } from '../../../../components/Button/Button';
import { Badge } from '../../../../components/Badge/Badge';
import { Alert } from '../../../../components/Alert/Alert';
import { BuildingIcon, UsersIcon, ClockIcon, ShieldIcon } from '../../../../components/Icons';

interface EmpresaDetalleModalProps {
  empresaId: string | null;
  onClose: () => void;
}

export const EmpresaDetalleModal: React.FC<EmpresaDetalleModalProps> = ({ empresaId, onClose }) => {
  const [empresa, setEmpresa] = useState<EmpresaResumenDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaId) {
      setEmpresa(null);
      return;
    }

    const fetchDetalle = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await empresasService.getResumen(empresaId);
        setEmpresa(data);
      } catch (err: unknown) {
        setErrorMsg(getApiErrorMessage(err, 'Error al obtener el resumen de la empresa'));
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [empresaId]);

  if (!empresaId) return null;

  return (
    <Modal
      isOpen={!!empresaId}
      onClose={onClose}
      title={
        <div className={styles.modalHeaderTitle}>
          <BuildingIcon size={20} />
          <span>Resumen de Empresa</span>
        </div>
      }
      maxWidth="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Cargando información de la empresa...</p>
        </div>
      ) : errorMsg ? (
        <Alert variant="error" title="Error">
          {errorMsg}
        </Alert>
      ) : empresa ? (
        <div className={styles.content}>
          <div className={styles.heroRow}>
            <div className={styles.heroInfo}>
              <h3 className={styles.companyName}>{empresa.nombre}</h3>
              <p className={styles.companyId}>ID: {empresa.id}</p>
            </div>
            <div className={styles.heroBadges}>
              <Badge variant={empresa.estado === 'Activa' ? 'success' : 'danger'} size="md">
                {empresa.estado}
              </Badge>
              <Badge variant="primary" size="md">
                {empresa.tipo_suscripcion || 'Sin suscripción activa'}
              </Badge>
            </div>
          </div>

          {/* Tarjetas de Métricas de Personal y Servicio */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <UsersIcon size={18} className={styles.metricIcon} />
                <span className={styles.metricTitle}>Coordinadores</span>
              </div>
              <span className={styles.metricValue}>{empresa.cantidad_coordinadores}</span>
              <span className={styles.metricSub}>Usuarios registrados</span>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <UsersIcon size={18} className={styles.metricIcon} />
                <span className={styles.metricTitle}>Técnicos</span>
              </div>
              <span className={styles.metricValue}>{empresa.cantidad_tecnicos}</span>
              <span className={styles.metricSub}>Personal operativo</span>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <ClockIcon size={18} className={styles.metricIcon} />
                <span className={styles.metricTitle}>Días con Servicio</span>
              </div>
              <span className={styles.metricValue}>{empresa.dias_con_servicio}</span>
              <span className={styles.metricSub}>Días acumulados</span>
            </div>
          </div>

          {/* Información de Contacto y Fechas */}
          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>Información de Contacto y Registro</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Correo de Contacto</span>
                <span className={styles.infoValue}>{empresa.correo_contacto}</span>
              </div>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Teléfono de Contacto</span>
                <span className={styles.infoValue}>{empresa.telefono}</span>
              </div>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Fecha de Registro</span>
                <span className={styles.infoValue}>
                  {empresa.fecha_registro
                    ? new Date(empresa.fecha_registro).toLocaleString()
                    : 'No registrada'}
                </span>
              </div>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Estado Operativo</span>
                <span className={styles.infoValue}>
                  {empresa.isActive ? 'Habilitada (Activa)' : 'Deshabilitada (Inactiva)'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.privacyNote}>
            <ShieldIcon size={16} />
            <span>
              Como <strong>owner_gosyt</strong>, accedes al resumen general de métricas operativas
              manteniendo el aislamiento multi-tenant de las empresas clientes.
            </span>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
