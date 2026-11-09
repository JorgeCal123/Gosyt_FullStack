import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ActivationTokenModal.module.css';
import { Modal } from '../../../../components/Modal/Modal';
import { Button } from '../../../../components/Button/Button';
import { Alert } from '../../../../components/Alert/Alert';
import { Badge } from '../../../../components/Badge/Badge';
import { CopyIcon, CheckIcon, KeyIcon, BuildingIcon, UserIcon } from '../../../../components/Icons';
import type { AceptarSolicitudResponse } from '../../types';

interface ActivationTokenModalProps {
  data: AceptarSolicitudResponse | null;
  onClose: () => void;
}

export const ActivationTokenModal: React.FC<ActivationTokenModalProps> = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!data) return null;

  const handleCopy = () => {
    if (data.token_activacion) {
      navigator.clipboard.writeText(data.token_activacion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleGoToActivation = () => {
    const params = new URLSearchParams();
    if (data.token_activacion) params.set('token', data.token_activacion);
    if (data.empresa?.nombre) params.set('empresa', data.empresa.nombre);
    if (data.empresa?.correo_contacto) params.set('correo', data.empresa.correo_contacto);
    if (data.empresa?.telefono) params.set('telefono', data.empresa.telefono);

    onClose();
    navigate(`/activar-cuenta?${params.toString()}`);
  };

  return (
    <Modal
      isOpen={!!data}
      onClose={onClose}
      title="Solicitud Aceptada con Éxito"
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleGoToActivation}
            leftIcon={<KeyIcon size={16} />}
          >
            Ir a Crear Contraseña
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <Alert variant="success" title="Empresa y Administrador Creados">
          {data.message}
        </Alert>

        <div className={styles.summaryGrid}>
          <div className={styles.cardBox}>
            <div className={styles.boxTitle}>
              <BuildingIcon size={16} />
              <span>Empresa Creada</span>
            </div>
            <p className={styles.boldText}>{data.empresa?.nombre}</p>
            <p className={styles.mutedText}>{data.empresa?.correo_contacto}</p>
            <Badge variant="success" size="sm" className={styles.badge}>
              Prueba de 30 días activa
            </Badge>
          </div>

          <div className={styles.cardBox}>
            <div className={styles.boxTitle}>
              <UserIcon size={16} />
              <span>Admin Empresa Creado</span>
            </div>
            <p className={styles.boldText}>
              {data.admin?.nombre} {data.admin?.apellido}
            </p>
            <p className={styles.mutedText}>{data.admin?.correo}</p>
            <Badge variant="warning" size="sm" className={styles.badge}>
              PENDIENTE_CREACION
            </Badge>
          </div>
        </div>

        {data.token_activacion && (
          <div className={styles.tokenSection}>
            <div className={styles.tokenHeader}>
              <span className={styles.tokenTitle}>Token de Activación Inicial</span>
              <span className={styles.tokenHint}>
                (Generado para configurar la contraseña del administrador)
              </span>
            </div>

            <div className={styles.tokenBox}>
              <code className={styles.tokenCode}>{data.token_activacion}</code>
              <Button
                variant={copied ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              >
                {copied ? '¡Copiado!' : 'Copiar'}
              </Button>
            </div>

            <p className={styles.devNote}>
              💡 <strong>Aviso de entorno:</strong> Mientras el sistema de envío de correos no esté activo,
              este token se expone en pantalla para que el <strong>admin_empresa</strong> pueda establecer su contraseña antes de iniciar sesión.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
