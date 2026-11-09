import React, { useState, useEffect, useCallback } from 'react';
import styles from './EmpresasResumenList.module.css';
import { empresasService } from '../../services/empresas.service';
import type { EmpresaResumenDTO } from '../../types';
import { getApiErrorMessage } from '../../../../lib/apiClient';
import { Table, type Column } from '../../../../components/Table/Table';
import { Button } from '../../../../components/Button/Button';
import { Badge } from '../../../../components/Badge/Badge';
import { Alert } from '../../../../components/Alert/Alert';
import { EmpresaDetalleModal } from '../EmpresaDetalleModal/EmpresaDetalleModal';
import { BuildingIcon, RefreshIcon, EyeIcon } from '../../../../components/Icons';

export const EmpresasResumenList: React.FC = () => {
  const [empresas, setEmpresas] = useState<EmpresaResumenDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null);

  const fetchResumenes = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await empresasService.listarResumenes();
      setEmpresas(data);
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Error al cargar las empresas'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumenes();
  }, [fetchResumenes]);

  const columns: Column<EmpresaResumenDTO>[] = [
    {
      header: 'Empresa',
      accessor: (item) => (
        <div className={styles.empresaCell}>
          <div className={styles.empresaIcon}>
            <BuildingIcon size={18} />
          </div>
          <div>
            <span className={styles.empresaNombre}>{item.nombre}</span>
            <span className={styles.empresaId}>ID: {item.id.slice(0, 8)}...</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Contacto',
      accessor: (item) => (
        <div className={styles.contactoCell}>
          <span className={styles.contactoCorreo}>{item.correo_contacto}</span>
          <span className={styles.contactoTelefono}>{item.telefono}</span>
        </div>
      ),
    },
    {
      header: 'Estado',
      accessor: (item) => (
        <Badge variant={item.estado === 'Activa' ? 'success' : 'danger'}>
          {item.estado}
        </Badge>
      ),
    },
    {
      header: 'Coordinadores',
      accessor: (item) => (
        <div className={styles.countBadge}>
          <span className={styles.countNumber}>{item.cantidad_coordinadores}</span>
        </div>
      ),
    },
    {
      header: 'Técnicos',
      accessor: (item) => (
        <div className={styles.countBadge}>
          <span className={styles.countNumber}>{item.cantidad_tecnicos}</span>
        </div>
      ),
    },
    {
      header: 'Suscripción',
      accessor: (item) => (
        <Badge variant={item.tipo_suscripcion ? 'primary' : 'neutral'}>
          {item.tipo_suscripcion || 'Sin plan'}
        </Badge>
      ),
    },
    {
      header: 'Días con Servicio',
      accessor: (item) => (
        <span className={styles.diasText}>
          {item.dias_con_servicio} {item.dias_con_servicio === 1 ? 'día' : 'días'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedEmpresaId(item.id)}
          leftIcon={<EyeIcon size={14} />}
        >
          Ver Resumen
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Resumen General de Empresas Clientes</h2>
          <p className={styles.subtitle}>
            Métricas consolidadas de usuarios y estado de servicio de todas las empresas.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchResumenes}
          loading={loading}
          leftIcon={<RefreshIcon size={16} />}
        >
          Actualizar
        </Button>
      </div>

      {errorMsg && (
        <Alert variant="error" onClose={() => setErrorMsg(null)} className={styles.alert}>
          {errorMsg}
        </Alert>
      )}

      <Table
        columns={columns}
        data={empresas}
        keyExtractor={(item) => item.id}
        loading={loading}
        emptyMessage="No hay empresas clientes registradas por el momento."
      />

      {/* Modal con el resumen de una sola empresa */}
      <EmpresaDetalleModal
        empresaId={selectedEmpresaId}
        onClose={() => setSelectedEmpresaId(null)}
      />
    </div>
  );
};
