import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'sonner'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Registro from './pages/Registro'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import DashboardLayout from './components/layout/DashboardLayout'

import Dashboard from './pages/Dashboard'
import Simulador from './pages/Simulador'
import Historial from './pages/Historial'
import ResultadoDetalle from './pages/ResultadoDetalle'
import Glosario from './pages/Glosario'

import AdminPanel from './pages/admin/AdminPanel'
import AdminReportes from './pages/admin/AdminReportes'
import AdminEscenarios from './pages/admin/AdminEscenarios'
import AdminConfiguracion from './pages/admin/AdminConfiguracion'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-right" theme="dark" />
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulador" element={<Simulador />} />
              <Route path="/historial" element={<Historial />} />
              <Route path="/simulacion/:id" element={<ResultadoDetalle />} />
              <Route path="/glosario" element={<Glosario />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/reportes" element={<AdminReportes />} />
              <Route path="/admin/escenarios" element={<AdminEscenarios />} />
              <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
