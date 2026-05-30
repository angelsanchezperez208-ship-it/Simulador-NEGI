import { NavLink } from 'react-router-dom'
import {
  Home, Play, Clock, BookOpen, User, Shield, BarChart3,
  Settings, LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Dashboard',  Icon: Home },
  { to: '/simulador', label: 'Simulador',  Icon: Play },
  { to: '/historial', label: 'Historial',  Icon: Clock },
  { to: '/glosario',  label: 'Glosario',   Icon: BookOpen },
  { to: '/perfil',    label: 'Mi Perfil',  Icon: User },
]

const NAV_ADMIN = [
  { to: '/admin',            label: 'Panel Admin', Icon: Shield },
  { to: '/admin/reportes',   label: 'Reportes',    Icon: BarChart3 },
  { to: '/admin/escenarios', label: 'Escenarios',  Icon: Settings },
]

export default function Sidebar() {
  const { usuario, cerrarSesion } = useAuth()
  const isAdmin = usuario?.rol === 'admin'

  return (
    <aside style={{
      width: 256, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      background: 'var(--surface)', borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', padding: 18,
    }}>
      {/* Logo */}
      <div style={{ padding: '8px 8px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src="/anahuac-logo.png"
          alt="Anáhuac"
          style={{ width: 40, height: 40, borderRadius: 11, boxShadow: '0 4px 10px rgba(251,100,0,0.28)' }}
        />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Simulador <span style={{ color: 'var(--brand)' }}>NEGI</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Universidad Anáhuac Mayab</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
        {NAV.map(({ to, label, Icon }) => (
          <SidebarItem key={to} to={to} label={label} Icon={Icon} />
        ))}

        {isAdmin && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', padding: '18px 14px 8px' }}>
              Administración
            </div>
            {NAV_ADMIN.map(({ to, label, Icon }) => (
              <SidebarItem key={to} to={to} label={label} Icon={Icon} />
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <button
        onClick={cerrarSesion}
        style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 14px', borderRadius: 12, fontSize: 15, fontWeight: 600, color: 'var(--muted)', transition: 'all .2s', width: '100%', textAlign: 'left' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(229,72,77,0.10)'; e.currentTarget.style.color = 'var(--neg)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
      >
        <LogOut size={19} /> Cerrar sesión
      </button>
    </aside>
  )
}

function SidebarItem({ to, label, Icon }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 13, padding: '11px 14px', borderRadius: 12,
        fontSize: 15, fontWeight: 600, textDecoration: 'none', position: 'relative',
        color: isActive ? 'var(--brand)' : 'var(--ink-2)',
        background: isActive ? 'var(--brand-tint)' : 'transparent',
        transition: 'all .2s',
      })}
      onMouseEnter={(e) => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
        if (!isActive) { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.color = 'var(--ink)' }
      }}
      onMouseLeave={(e) => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
        if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)' }
      }}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span style={{ position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)', width: 4, height: 22, borderRadius: 99, background: 'var(--brand)' }} />
          )}
          <Icon size={19} />
          {label}
        </>
      )}
    </NavLink>
  )
}
