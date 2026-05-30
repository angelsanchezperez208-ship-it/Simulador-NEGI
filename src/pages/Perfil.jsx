import { useState } from 'react'
import { Mail, Award, BarChart3, Flame, Trophy, Moon, Sun, Bell, Zap, Globe, Lock, CheckCircle, Edit } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ProgressRing, ProgressBar, Badge, Reveal } from '../components/ui'

/* Mock gamification data */
const MOCK_USER = { nivel: 7, xp: 2840, xpNext: 3200, racha: 5, rank: 'Exportador Avanzado' }

const LOGROS = [
  { id: 'a1', icon: '🚀', titulo: 'Primer despegue',    desc: 'Completaste tu primera simulación', unlocked: true,  color: '#2F6BFF' },
  { id: 'a2', icon: '📈', titulo: 'Números verdes',     desc: 'Lograste utilidad positiva 3 veces', unlocked: true, color: '#16A34A' },
  { id: 'a3', icon: '🔥', titulo: 'En racha',           desc: 'Simula 5 días seguidos',             unlocked: true,  color: '#F59E0B' },
  { id: 'a4', icon: '🛡️', titulo: 'Maestro del T-MEC', desc: 'Domina el escenario base',           unlocked: true,  color: '#8B5CF6' },
  { id: 'a5', icon: '🧭', titulo: 'Explorador',         desc: 'Prueba los 4 escenarios',            unlocked: false, color: '#14B8A6' },
  { id: 'a6', icon: '⭐', titulo: 'Utilidad récord',    desc: 'Supera $300,000 de utilidad',        unlocked: false, color: '#F43F6B' },
  { id: 'a7', icon: '🎓', titulo: 'Experto exportador', desc: 'Alcanza el nivel 10',                unlocked: false, color: '#FB6400' },
  { id: 'a8', icon: '🏆', titulo: 'Leyenda NEGI',       desc: 'Completa 50 simulaciones',           unlocked: false, color: '#F59E0B' },
]

export default function Perfil() {
  const { usuario } = useAuth()
  const { theme, setTheme } = useTheme()

  const [notif, setNotif] = useState(true)
  const [sonido, setSonido] = useState(false)
  const [idioma, setIdioma] = useState('es')

  const initials = usuario?.nombre
    ? usuario.nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  const xpPct = Math.round((MOCK_USER.xp / MOCK_USER.xpNext) * 100)
  const unlocked = LOGROS.filter((l) => l.unlocked).length

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <Reveal>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Mi Perfil</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>Gestiona tu cuenta, progreso y preferencias</p>
        </div>
      </Reveal>

      {/* Hero card */}
      <Reveal delay={60}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, padding: 30, boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
          {/* Orange band */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 96, background: 'linear-gradient(120deg, var(--brand), var(--brand-strong))' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 22, flexWrap: 'wrap' }}>
            {/* Avatar */}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 20 }}>
        <Reveal delay={120}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 20, boxShadow: 'var(--shadow-sm)' }}>
            <ProgressRing pct={xpPct} size={92} stroke={9}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--brand)' }}>{MOCK_USER.nivel}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>NIVEL</div>
              </div>
            </ProgressRing>
            <div style={{ flex: 1 }}>
              <Badge color="var(--brand)"><Award size={13} /> {MOCK_USER.rank}</Badge>
              <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                {MOCK_USER.xp.toLocaleString('es-MX')} / {MOCK_USER.xpNext.toLocaleString('es-MX')} XP
              </div>
              <div style={{ marginTop: 8 }}><ProgressBar pct={xpPct} height={8} /></div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                {(MOCK_USER.xpNext - MOCK_USER.xp).toLocaleString('es-MX')} XP para nivel {MOCK_USER.nivel + 1}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <MiniStat Icon={BarChart3} color="#2F6BFF" value="5" label="simulaciones" />
            <div style={{ width: 1, height: 52, background: 'var(--line)' }} />
            <MiniStat Icon={Flame} color="#F59E0B" value={MOCK_USER.racha} label="racha" />
            <div style={{ width: 1, height: 52, background: 'var(--line)' }} />
            <MiniStat Icon={Trophy} color="#14B8A6" value={`${unlocked}/${LOGROS.length}`} label="logros" />
          </div>
        </Reveal>
      </div>

      {/* Achievements grid */}
      <Reveal delay={200}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 18 }}>Logros</h3>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4, marginBottom: 18 }}>
            Has desbloqueado {unlocked} de {LOGROS.length} logros
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {LOGROS.map((l) => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--line)', opacity: l.unlocked ? 1 : 0.55, position: 'relative' }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', background: l.unlocked ? l.color : 'var(--bg-2)', color: l.unlocked ? '#fff' : 'var(--muted)', fontSize: 20, boxShadow: l.unlocked ? `0 4px 12px color-mix(in srgb, ${l.color} 35%, transparent)` : 'none' }}>
                  {l.unlocked ? l.icon : <Lock size={18} />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{l.titulo}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.3 }}>{l.desc}</div>
                </div>
                {l.unlocked && <CheckCircle size={16} style={{ position: 'absolute', top: 10, right: 10, color: '#16A34A', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Settings */}
      <Reveal delay={240}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Configuración</h3>

          <SettingRow Icon={Moon} iconColor="#8B5CF6" title="Apariencia" desc="Elige entre modo claro u oscuro">
            <div style={{ display: 'flex', gap: 6, background: 'var(--bg-2)', borderRadius: 99, padding: 5 }}>
              {[['light', Sun, 'Claro'], ['dark', Moon, 'Oscuro']].map(([k, I, lbl]) => (
                <button key={k} onClick={() => setTheme(k)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 99, fontSize: 13.5, fontWeight: 700, color: theme === k ? '#fff' : 'var(--ink-2)', background: theme === k ? 'var(--brand)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all .2s' }}>
                  <I size={16} /> {lbl}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow Icon={Bell} iconColor="#2F6BFF" title="Notificaciones" desc="Recibe avisos de logros y recordatorios">
            <Switch on={notif} onToggle={() => setNotif(!notif)} />
          </SettingRow>

          <SettingRow Icon={Zap} iconColor="#F59E0B" title="Efectos de sonido" desc="Sonidos al completar simulaciones">
            <Switch on={sonido} onToggle={() => setSonido(!sonido)} />
          </SettingRow>

          <SettingRow Icon={Globe} iconColor="#14B8A6" title="Idioma" desc="Idioma de la interfaz" last>
            <div style={{ display: 'flex', gap: 6, background: 'var(--bg-2)', borderRadius: 99, padding: 5 }}>
              {[['es', 'Español'], ['en', 'English']].map(([k, lbl]) => (
                <button key={k} onClick={() => setIdioma(k)} style={{ padding: '8px 16px', borderRadius: 99, fontSize: 13.5, fontWeight: 700, color: idioma === k ? '#fff' : 'var(--ink-2)', background: idioma === k ? 'var(--brand)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all .2s' }}>
                  {lbl}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
      </Reveal>
    </div>
  )
}

function MiniStat({ Icon, color, value, label }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 72 }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, margin: '0 auto', display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}>
        <Icon size={21} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, marginTop: 8, color: 'var(--ink)' }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function SettingRow({ Icon, iconColor, title, desc, children, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: last ? 'none' : '1px solid var(--line)', flexWrap: 'wrap' }}>
      <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${iconColor} 13%, transparent)`, color: iconColor }}>
        <Icon size={20} />
      </span>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{desc}</div>
      </div>
      {children}
    </div>
  )
}

function Switch({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{ width: 52, height: 30, borderRadius: 99, padding: 3, background: on ? 'var(--brand)' : 'var(--line-strong)', transition: 'background .25s', position: 'relative', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 25 : 3, width: 24, height: 24, borderRadius: 99, background: '#fff', transition: 'left .25s cubic-bezier(.22,1,.36,1)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'block' }} />
    </button>
  )
}
