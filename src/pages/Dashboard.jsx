import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Flame, Trophy, Award, Play, ChevronRight, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getHistorial } from '../api/simulaciones'
import { formatCurrency, formatDate } from '../lib/utils'
import { CountNum, ProgressBar, ProgressRing, Reveal, Badge } from '../components/ui'
import Spinner from '../components/Spinner'

/* Mock gamification data — swap with real API when backend is ready */
const MOCK_USER = {
  nivel: 7, xp: 2840, xpNext: 3200, racha: 5, rank: 'Exportador Avanzado',
}

const LOGROS = [
  { icon: '🚀', titulo: 'Primer despegue',  desc: 'Completaste tu primera simulación', unlocked: true,  color: '#2F6BFF' },
  { icon: '📈', titulo: 'Números verdes',   desc: 'Utilidad positiva 3 veces',         unlocked: true,  color: '#16A34A' },
  { icon: '🔥', titulo: 'En racha',         desc: 'Simula 5 días seguidos',             unlocked: true,  color: '#F59E0B' },
  { icon: '🛡️', titulo: 'Maestro del T-MEC', desc: 'Domina el escenario base',         unlocked: true,  color: '#8B5CF6' },
  { icon: '🧭', titulo: 'Explorador',       desc: 'Prueba los 4 escenarios',            unlocked: false, color: '#14B8A6' },
  { icon: '⭐', titulo: 'Utilidad récord',  desc: 'Supera $300,000 de utilidad',        unlocked: false, color: '#F43F6B' },
]

const NIVEL_COLOR = { 'Básico': '#16A34A', 'Intermedio': '#F59E0B', 'Avanzado': '#8B5CF6' }

export default function Dashboard() {
  const { usuario } = useAuth()
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistorial(usuario.token, 1, 5)
      .then((data) => setHistorial(data.simulaciones || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [usuario.token])

  const firstName = usuario.nombre?.split(' ')[0] ?? usuario.nombre
  const totalSims = historial.length
  const ultimaUtilidad = historial[0]?.resultados?.utilidad_neta ?? null
  const topEscenario = historial.length
    ? Object.entries(historial.reduce((acc, s) => {
        const n = s.escenario?.nombre || 'Desconocido'
        acc[n] = (acc[n] || 0) + 1
        return acc
      }, {})).sort((a, b) => b[1] - a[1])[0]?.[0]
    : '—'

  const xpPct = Math.round((MOCK_USER.xp / MOCK_USER.xpNext) * 100)
  const unlockedLogros = LOGROS.filter((l) => l.unlocked).length

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Greeting */}
      <Reveal>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>
            Hola, {firstName} <span style={{ display: 'inline-block', animation: 'floaty 2.5s ease-in-out infinite' }}>👋</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>
            Bienvenido de vuelta al Simulador de Negocios Internacionales
          </p>
        </div>
      </Reveal>

      {/* Gamification banner */}
      <Reveal delay={60}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, padding: 26, display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap', boxShadow: 'var(--shadow-md)', backgroundImage: 'linear-gradient(120deg, color-mix(in srgb, var(--brand) 8%, var(--surface)), var(--surface))' }}>
          <ProgressRing pct={xpPct} size={104} stroke={10}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Nivel</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: 'var(--brand)' }}>{MOCK_USER.nivel}</div>
            </div>
          </ProgressRing>

          <div style={{ flex: 1, minWidth: 220 }}>
            <Badge color="var(--brand)"><Award size={14} /> {MOCK_USER.rank}</Badge>
            <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' }}>
              <CountNum value={MOCK_USER.xp} style={{ fontWeight: 800, color: 'var(--ink)' }} /> / {MOCK_USER.xpNext.toLocaleString('es-MX')} XP
            </div>
            <div style={{ marginTop: 10 }}><ProgressBar pct={xpPct} /></div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
              {(MOCK_USER.xpNext - MOCK_USER.xp).toLocaleString('es-MX')} XP para subir al nivel {MOCK_USER.nivel + 1}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18 }}>
            <MiniStat Icon={Flame}  color="#F59E0B" value={MOCK_USER.racha}    label="días de racha" />
            <MiniStat Icon={Trophy} color="#14B8A6" value={unlockedLogros}     label="logros" />
          </div>
        </div>
      </Reveal>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
        <Reveal delay={120}>
          <StatCard Icon={BarChart3} color="#2F6BFF" label="Simulaciones realizadas"
            value={loading ? null : totalSims} sub="en total" />
        </Reveal>
        <Reveal delay={180}>
          <StatCard Icon={null} color={ultimaUtilidad != null && parseFloat(ultimaUtilidad) >= 0 ? '#16A34A' : '#E5484D'}
            label="Última utilidad neta"
            value={loading ? null : ultimaUtilidad != null ? parseFloat(ultimaUtilidad) : null}
            isMoney={ultimaUtilidad != null}
            textValue={ultimaUtilidad == null ? '—' : undefined}
            sub="simulación más reciente"
            valueColor={ultimaUtilidad != null ? (parseFloat(ultimaUtilidad) >= 0 ? '#16A34A' : '#E5484D') : 'var(--ink)'} />
        </Reveal>
        <Reveal delay={240}>
          <StatCard Icon={null} color="#16A34A" label="Escenario favorito"
            textValue={loading ? '...' : topEscenario} sub="el más usado" />
        </Reveal>
      </div>

      {/* CTA Nueva Simulación */}
      <Reveal delay={280}>
        <Link
          to="/simulador"
          style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 22, padding: 30, background: 'linear-gradient(120deg, var(--brand), var(--brand-strong))', color: '#fff', boxShadow: 'var(--shadow-brand)', transition: 'transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 42px rgba(251,100,0,0.42)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-brand)' }}
        >
          <div style={{ position: 'absolute', top: -50, right: 80, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26 }}>Nueva Simulación</div>
            <div style={{ fontSize: 16, opacity: 0.92, marginTop: 6 }}>Elige un escenario e ingresa tus decisiones de exportación</div>
          </div>
          <div style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
            <Play size={26} fill="#fff" strokeWidth={0} />
          </div>
        </Link>
      </Reveal>

      {/* Two-column: recent sims + achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
        <Reveal delay={320}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 22, height: '100%', boxShadow: 'var(--shadow-sm)' }}>
            <SectionHead title="Últimas simulaciones" actionLabel="Ver todo" actionTo="/historial" />
            {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><Spinner /></div>}
            {!loading && historial.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 16 }}>Sin simulaciones aún.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              {historial.map((s) => {
                const utilidad = parseFloat(s.resultados?.utilidad_neta ?? 0)
                const nivel = s.escenario?.nivel
                return (
                  <Link key={s._id} to={`/simulacion/${s._id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--line)', textDecoration: 'none', transition: 'border-color .2s, transform .2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.transform = 'translateX(3px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {nivel && <span style={{ width: 8, height: 8, borderRadius: 99, background: NIVEL_COLOR[nivel] || 'var(--muted)', flexShrink: 0 }} />}
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>{s.escenario?.nombre || 'Escenario'}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{formatDate(s.createdAt)}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 14.5, color: utilidad >= 0 ? 'var(--pos)' : 'var(--neg)' }}>{formatCurrency(utilidad)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={360}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 22, height: '100%', boxShadow: 'var(--shadow-sm)' }}>
            <SectionHead title="Logros recientes" actionLabel="Ver perfil" actionTo="/perfil" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              {LOGROS.slice(0, 4).map((l) => (
                <AchievementChip key={l.titulo} l={l} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function MiniStat({ Icon, color, value, label }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 78 }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, margin: '0 auto', display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}>
        <Icon size={22} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginTop: 8, color: 'var(--ink)' }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function StatCard({ Icon, color, label, value, textValue, isMoney, sub, valueColor = 'var(--ink)' }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 22, boxShadow: 'var(--shadow-sm)', transition: 'transform .25s, box-shadow .25s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
        {Icon && <span style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${color} 13%, transparent)`, color }}><Icon size={19} /></span>}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, marginTop: 14, color: valueColor }}>
        {textValue != null
          ? textValue
          : value == null
          ? '—'
          : isMoney
          ? <CountNum value={value} format={(v) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(v)} />
          : <CountNum value={value} />
        }
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function SectionHead({ title, actionLabel, actionTo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h3 style={{ fontSize: 18 }}>{title}</h3>
      <Link to={actionTo} style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
        {actionLabel} <ChevronRight size={15} />
      </Link>
    </div>
  )
}

function AchievementChip({ l }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--line)', opacity: l.unlocked ? 1 : 0.5 }}>
      <span style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: l.unlocked ? l.color : 'var(--bg-2)', color: l.unlocked ? '#fff' : 'var(--muted)', fontSize: 18 }}>
        {l.unlocked ? l.icon : <Lock size={16} />}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.titulo}</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.desc}</div>
      </div>
    </div>
  )
}
