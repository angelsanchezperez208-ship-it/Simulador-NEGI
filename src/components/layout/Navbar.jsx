import { Link } from 'react-router-dom'
import { Bell, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const { usuario } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const initials = usuario?.nombre
    ? usuario.nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  const firstName = usuario?.nombre?.split(' ')[0] ?? ''

  return (
    <header style={{
      height: 74, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      gap: 14, padding: '0 32px', borderBottom: '1px solid var(--line)',
      position: 'sticky', top: 0, zIndex: 30,
      background: 'color-mix(in srgb, var(--bg) 82%, transparent)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Bell */}
      <button style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', color: 'var(--ink-2)', border: '1.5px solid var(--line-strong)', background: 'var(--surface)', position: 'relative', transition: 'all .2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.borderColor = 'var(--brand)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-2)'; e.currentTarget.style.borderColor = 'var(--line-strong)' }}>
        <Bell size={19} />
        <span style={{ position: 'absolute', top: 9, right: 9, width: 7, height: 7, borderRadius: 99, background: 'var(--brand)' }} />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', color: 'var(--ink-2)', border: '1.5px solid var(--line-strong)', background: 'var(--surface)', transition: 'all .2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.borderColor = 'var(--brand)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-2)'; e.currentTarget.style.borderColor = 'var(--line-strong)' }}
      >
        {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
      </button>

      {/* User chip */}
      <Link
        to="/perfil"
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 6px', borderRadius: 99, border: '1.5px solid var(--line)', background: 'var(--surface)', textDecoration: 'none', transition: 'border-color .2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)' }}
      >
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), #FF9046)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: 13, flexShrink: 0 }}>
          {initials}
        </span>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{firstName}</div>
          <div style={{ fontSize: 11.5, color: 'var(--brand)', fontWeight: 600, textTransform: 'capitalize' }}>{usuario?.rol}</div>
        </div>
      </Link>
    </header>
  )
}
