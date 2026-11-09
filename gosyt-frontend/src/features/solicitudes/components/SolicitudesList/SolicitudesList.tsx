import React, { useState, useEffect, useCallback } from 'react';
import styles from './SolicitudesList.module.css';
import { solicitudesService } from '../../services/solicitudes.service';
import type { ISolicitud, EstadoSolicitud, AceptarSolicitudResponse } from '../../types';
import { getApiErrorMessage } from '../../../../lib/apiClient';
import { Table, type Column } from '../../../../components/Table/Table';
import { Button } from '../../../../components/Button/Button';
import { Badge } from '../../../../components/Badge/Badge';
import { Alert } from '../../../../components/Alert/Alert';
import { ActivationTokenModal } from '../ActivationTokenModal/ActivationTokenModal';
import { CheckIcon, XIcon, RefreshIcon } from '../../../../components/Icons';

export const SolicitudesList: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<ISolicitud[]>([]);
  const [filterEstado, setFilterEstado] = useState<string>(''); // '' = Todas
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados de acción por ID
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [acceptedData, setAcceptedData] = useState<AceptarSolicitudResponse | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await solicitudesService.listar(filterEstado || undefined);
      setSolicitudes(data);
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Error al cargar las solicitudes'));
    } finally {
      setLoading(false);
    }
  }, [filterEstado]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const handleAceptar = async (solicitud: ISolicitud) => {
    setActionLoadingId(solicitud.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await solicitudesService.aceptar(solicitud.id);
      setAcceptedData(response);
      setSuccessMsg(`Solicitud de "${solicitud.nombre_empresa}" aceptada con éxito.`);
      await fetchSolicitudes();
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Error al aceptar la solicitud'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRechazar = async (solicitud: ISolicitud) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de rechazar y eliminar la solicitud de "${solicitud.nombre_empresa}"? Esta acción no se puede deshacer.`
    );
    if (!confirmacion) return;

    setActionLoadingId(solicitud.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await solicitudesService.rechazar(solicitud.id);
      setSuccessMsg(res.message || 'Solicitud rechazada y eliminada de MongoDB.');
      await fetchSolicitudes();
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Error al rechazar la solicitud'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const getEstadoBadge = (estado: EstadoSolicitud) => {
    switch (estado) {
      case 'Pendiente':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'Aceptada':
        return <Badge variant="success">Aceptada</Badge>;
      case 'Rechazada':
        return <Badge variant="danger">Rechazada</Badge>;
      default:
        return <Badge variant="neutral">{estado}</Badge>;
    }
  };

  const columns: Column<ISolicitud>[] = [
    {
      header: 'Empresa',
      accessor: (item) => (
        <div className={styles.empresaCell}>
          <span className={styles.empresaNombre}>{item.nombre_empresa}</span>
          <span className={styles.empresaId}>ID: {item.id.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      header: 'Solicitante',
      accessor: (item) => (
        <div>
          <span className={styles.solicitanteNombre}>
            {item.nombre_solicitante} {item.apellido_solicitante}
          </span>
        </div>
      ),
    },
    {
      header: 'Contacto',
      accessor: (item) => (
        <div className={styles.contactoCell}>
          <span className={styles.contactoCorreo}>{item.correo}</span>
          <span className={styles.contactoTelefono}>{item.telefono}</span>
        </div>
      ),
    },
    {
      header: 'Fecha Solicitud',
      accessor: (item) => (
        <span className={styles.dateCell}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (item) => getEstadoBadge(item.estado),
    },
    {
      header: 'Acciones',
      accessor: (item) => {
        const isProcessing = actionLoadingId === item.id;
        if (item.estado !== 'Pendiente') {
          return (
            <span className={styles.processedText}>
              {item.estado === 'Aceptada' ? 'Aceptada' : 'Rechazada'}
            </span>
          );
        }

        return (
          <div className={styles.actions}>
            <Button
              variant="primary"
              size="sm"
              loading={isProcessing}
              disabled={!!actionLoadingId}
              onClick={() => handleAceptar(item)}
              leftIcon={<CheckIcon size={14} />}
            >
              Aceptar
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={isProcessing}
              disabled={!!actionLoadingId}
              onClick={() => handleRechazar(item)}
              leftIcon={<XIcon size={14} />}
            >
              Rechazar
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Solicitudes de Registro</h2>
          <p className={styles.subtitle}>
            Gestiona las peticiones de nuevas empresas interesadas en probar GoSYT.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchSolicitudes}
          loading={loading}
          leftIcon={<RefreshIcon size={16} />}
        >
          Actualizar
        </Button>
      </div>

      {/* Barra de Filtros */}
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>Filtrar por estado:</span>
        <div className={styles.filterButtons}>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterEstado === '' ? styles.activeFilter : ''}`}
            onClick={() => setFilterEstado('')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${
              filterEstado === 'Pendiente' ? styles.activeFilter : ''
            }`}
            onClick={() => setFilterEstado('Pendiente')}
          >
            Pendientes
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${
              filterEstado === 'Aceptada' ? styles.activeFilter : ''
            }`}
            onClick={() => setFilterEstado('Aceptada')}
          >
            Aceptadas
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${
              filterEstado === 'Rechazada' ? styles.activeFilter : ''
            }`}
            onClick={() => setFilterEstado('Rechazada')}
          >
            Rechazadas
          </button>
        </div>
      </div>

      {errorMsg && (
        <Alert variant="error" onClose={() => setErrorMsg(null)} className={styles.alert}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert variant="success" onClose={() => setSuccessMsg(null)} className={styles.alert}>
          {successMsg}
        </Alert>
      )}

      <Table
        columns={columns}
        data={solicitudes}
        keyExtractor={(item) => item.id}
        loading={loading}
        emptyMessage={
          filterEstado
            ? `No hay solicitudes con estado "${filterEstado}".`
            : 'No hay solicitudes de registro por el momento.'
        }
      />

      {/* Modal con Token de Activación */}
      <ActivationTokenModal
        data={acceptedData}
        onClose={() => setAcceptedData(null)}
      />
    </div>
  );
};
