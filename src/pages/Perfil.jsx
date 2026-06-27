import { useEffect, useState } from 'react'
import { Mail, Award, BarChart3, Edit, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getHistorial } from '../api/simulaciones'
import { getNivelFromXP, calcXpProgress } from '../lib/xpSystem'
import { ProgressRing, ProgressBar, Badge, Reveal } from '../components/ui'

export default function Perfil() {
  const { usuario } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [totalSims, setTotalSims] = useState(0)

  useEffect(() => {
    getHistorial(usuario.token, 1, 1)
      .then((data) => setTotalSims(data.total ?? 0))
      .catch((err) => console.error(err))
  }, [usuario.token])

  const initials = usuario?.nombre
    ? usuario.nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  const xpActual = usuario?.xp || 0
  const nivelInfo = getNivelFromXP(xpActual)
  const xpPct = calcXpProgress(xpActual)
  const xpNextLabel = nivelInfo.xpNext === Infinity ? '∞' : nivelInfo.xpNext.toLocaleString('es-MX')
  const xpRestante = nivelInfo.xpNext === Infinity ? 0 : nivelInfo.xpNext - xpActual

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <Reveal>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Mi Perfil</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>Gestiona tu cuenta y revisa tu progreso</p>
        </div>
      </Reveal>

      {/* Hero card */}
      <Reveal delay={60}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, padding: 30, boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 96, background: 'linear-gradient(120deg, var(--brand), var(--brand-strong))' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 22, flexWrap: 'wrap' }}>
            <div style={{ marginTop: 36, width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), #FF9046)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: 36, boxShadow: '0 0 0 4px var(--brand-tint), 0 4px 16px rgba(251,100,0,0.28)', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 220, paddingBottom: 4 }}>
              <h2 style={{ fontSize: 28 }}>{usuario?.nombre}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={15} /> {usuario?.email}
                </span>
                <Badge color="var(--brand)" solid><Award size={13} /> {usuario?.rol}</Badge>
              </div>
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--surface)', border: '1.5px solid var(--line-strong)', borderRadius: 10, fontWeight: 700, fontSize: 14, color: 'var(--ink)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'all .2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
              <Edit size={16} /> Editar perfil
            </button>
          </div>
        </div>
      </Reveal>

      {/* Progress + mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 18, marginBottom: 20 }}>
        <Reveal delay={120}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 20, boxShadow: 'var(--shadow-sm)' }}>
            <ProgressRing pct={xpPct} size={92} stroke={9}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--brand)' }}>{nivelInfo.nivel}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>NIVEL</div>
              </div>
            </ProgressRing>
            <div style={{ flex: 1 }}>
              <Badge color="var(--brand)"><Award size={13} /> {nivelInfo.rank}</Badge>
              <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                {xpActual.toLocaleString('es-MX')} / {xpNextLabel} XP
              </div>
              <div style={{ marginTop: 8 }}><ProgressBar pct={xpPct} height={8} /></div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                {nivelInfo.xpNext === Infinity
                  ? '¡Nivel máximo alcanzado!'
                  : `${xpRestante.toLocaleString('es-MX')} XP para nivel ${nivelInfo.nivel + 1}`}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-sm)', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, margin: '0 auto', display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, var(--brand) 14%, transparent)' }}>
                <BarChart3 size={22} style={{ color: 'var(--brand)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginTop: 8, color: 'var(--ink)' }}>{totalSims}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>simulaciones</div>
            </div>

            <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--line)', margin: '0 16px' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--brand)' }}>
                {nivelInfo.nivel}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>nivel</div>
            </div>
          </div>
        </Reveal>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 16, padding: 28, marginTop: 24
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20,
          fontFamily: 'var(--font-display)' }}>Configuración</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Apariencia */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0', borderBottom: '1px solid var(--line)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10,
                background: 'rgba(139,92,246,0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={18} style={{ color: '#8B5CF6' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Apariencia</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  Elige entre modo claro u oscuro
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: theme === 'light' ? 'var(--brand)' : 'transparent',
                  color: theme === 'light' ? '#fff' : 'var(--muted)'
                }}
              >Claro</button>
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: theme === 'dark' ? 'var(--brand)' : 'transparent',
                  color: theme === 'dark' ? '#fff' : 'var(--muted)'
                }}
              >Oscuro</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

