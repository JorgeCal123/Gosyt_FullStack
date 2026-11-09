import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { SolicitarDemo } from '../pages/SolicitarDemo';
import { ActivateAccount } from '../pages/ActivateAccount';
import { Dashboard } from '../pages/Dashboard';
import { Empresas } from '../pages/Empresas';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/solicitar-demo" element={<SolicitarDemo />} />
        <Route path="/activar-cuenta" element={<ActivateAccount />} />

        {/* Rutas Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresas"
          element={
            <ProtectedRoute allowedRoles={['owner_gosyt', 'admin_empresa']}>
              <Empresas />
            </ProtectedRoute>
          }
        />

        {/* Redirecciones por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

