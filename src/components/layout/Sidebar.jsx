import { NavLink } from 'react-router-dom'
import {
  Home,
  Play,
  Clock,
  BookOpen,
  Shield,
  BarChart2,
  Settings,
  Sliders,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

const navLink = ({ isActive }) =>
  cn(
    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
    isActive
      ? 'bg-emerald-500/15 text-emerald-400'
      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
  )

export default function Sidebar() {
  const { usuario, cerrarSesion } = useAuth()

  return (
    <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col py-4 px-3">
      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/dashboard" className={navLink}>
          <Home size={16} /> Dashboard
        </NavLink>
        <NavLink to="/simulador" className={navLink}>
          <Play size={16} /> Simulador
        </NavLink>
        <NavLink to="/historial" className={navLink}>
          <Clock size={16} /> Historial
        </NavLink>
        <NavLink to="/glosario" className={navLink}>
          <BookOpen size={16} /> Glosario
        </NavLink>

        {usuario?.rol === 'admin' && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Administración
            </div>
            <NavLink to="/admin" end className={navLink}>
              <Shield size={16} /> Panel Admin
            </NavLink>
            <NavLink to="/admin/reportes" className={navLink}>
              <BarChart2 size={16} /> Reportes
            </NavLink>
            <NavLink to="/admin/escenarios" className={navLink}>
              <Settings size={16} /> Escenarios
            </NavLink>
            <NavLink to="/admin/configuracion" className={navLink}>
              <Sliders size={16} /> Configuración
            </NavLink>
          </>
        )}
      </nav>

      <button
        onClick={cerrarSesion}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </aside>
  )
}
