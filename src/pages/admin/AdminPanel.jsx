import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, BarChart3, TrendingUp, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getResumen } from '../../api/reportes'
import { getUsuarios, cambiarRol, eliminarUsuario } from '../../api/usuarios'
import { formatCurrency } from '../../lib/utils'
import { CountNum, Reveal } from '../../components/ui'
import Spinner from '../../components/Spinner'

const CHART_COLORS = ['#16A34A', '#8B5CF6', '#F59E0B', '#F43F6B']

export default function AdminPanel() {
  const { usuario } = useAuth()
  const [resumen, setResumen] = useState(null)
  const [loadingResumen, setLoadingResumen] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const [usPage, setUsPage] = useState(1)
  const [usTotal, setUsTotal] = useState({ total: 0, totalPages: 1 })
  const [loadingUs, setLoadingUs] = useState(true)
  const [errorResumen, setErrorResumen] = useState('')
  const [errorUs, setErrorUs] = useState('')

  useEffect(() => {
    setErrorResumen('')
    getResumen(usuario.token)
      .then(setResumen)
      .catch((err) => {
        const msg = err?.message || 'Error al cargar resumen'
        setErrorResumen(msg)
        toast.error(msg)
      })
      .finally(() => setLoadingResumen(false))
  }, [usuario.token])

  useEffect(() => {
    setLoadingUs(true)
    setErrorUs('')
    getUsuarios(usuario.token, usPage, 8)
      .then((data) => {
        const list = Array.isArray(data.usuarios) ? data.usuarios : []
        setUsuarios(list)
        setUsTotal({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 })
      })
      .catch((err) => {
        const msg = err?.message || 'Error al cargar usuarios'
        setErrorUs(msg)
        toast.error(msg)
      })
      .finally(() => setLoadingUs(false))
  }, [usuario.token, usPage])

  const handleCambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'estudiante' : 'admin'
    try {
      await cambiarRol(id, nuevoRol, usuario.token)
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u)))
      toast.success(`Rol cambiado a ${nuevoRol}`)
    } catch (err) { toast.error(err.message) }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return
    try {
      await eliminarUsuario(id, usuario.token)
      setUsuarios((prev) => prev.filter((u) => u.id !== id))
      toast.success('Usuario eliminado')
    } catch (err) { toast.error(err.message) }
  }

  const chartData = Array.isArray(resumen?.por_escenario)
    ? resumen.por_escenario.map((item, i) => ({ nombre: item.nombre, count: item.total, color: CHART_COLORS[i % CHART_COLORS.length] }))
    : []

  const utilidad = resumen?.utilidad_promedio
  const pos = utilidad != null && utilidad >= 0

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Reveal>
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Panel de Administración</h1>
      </Reveal>

      {/* Stats */}
      {loadingResumen ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
      ) : errorResumen ? (
        <ErrorBox title="No se pudo cargar el resumen" message={errorResumen} />
      ) : resumen && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
          <AdminStatCard Icon={Users}    color="#2F6BFF" label="Total usuarios"     value={resumen.total_usuarios ?? 0} />
          <AdminStatCard Icon={BarChart3} color="#8B5CF6" label="Total simulaciones" value={resumen.total_simulaciones ?? 0} />
          <AdminStatCard Icon={TrendingUp} color={pos ? '#16A34A' : '#E5484D'} label="Utilidad promedio" isMoney value={utilidad ?? 0} valueColor={pos ? '#16A34A' : '#E5484D'} />
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <Reveal delay={80}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: 17, marginBottom: 4 }}>Simulaciones por escenario</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Distribución del uso de escenarios</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={36}>
                <XAxis dataKey="nombre" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }} formatter={(v) => [v, 'Simulaciones']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      )}

      {/* Users table */}
      <Reveal delay={120}>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Usuarios</h2>
          {loadingUs ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
          ) : errorUs ? (
            <ErrorBox title="No se pudieron cargar los usuarios" message={errorUs} />
          ) : (
            <>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}>
                      {['Nombre', 'Email', 'Rol', ''].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '12px 20px', color: 'var(--muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: i < usuarios.length - 1 ? '1px solid var(--line)' : 'none', transition: 'background .15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--ink)' }}>{u.nombre}</td>
                        <td style={{ padding: '14px 20px', color: 'var(--muted)', fontSize: 13 }}>{u.email}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <button onClick={() => handleCambiarRol(u.id, u.rol)} disabled={u.id === usuario.id}
                            style={{ fontSize: 12.5, fontWeight: 700, padding: '4px 12px', borderRadius: 99, border: 'none', cursor: u.id === usuario.id ? 'not-allowed' : 'pointer', opacity: u.id === usuario.id ? 0.4 : 1, background: u.rol === 'admin' ? 'color-mix(in srgb, var(--brand) 14%, transparent)' : 'var(--bg-2)', color: u.rol === 'admin' ? 'var(--brand)' : 'var(--muted)', transition: 'all .2s' }}>
                            {u.rol}
                          </button>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <button onClick={() => handleEliminar(u.id)} disabled={u.id === usuario.id}
                            style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: u.id === usuario.id ? 'not-allowed' : 'pointer', opacity: u.id === usuario.id ? 0.3 : 1, transition: 'color .2s' }}
                            onMouseEnter={(e) => { if (u.id !== usuario.id) e.currentTarget.style.color = 'var(--neg)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)' }}>
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {usTotal.totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                  <button onClick={() => setUsPage((p) => Math.max(1, p - 1))} disabled={usPage === 1}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', background: 'none', border: 'none', cursor: 'pointer', opacity: usPage === 1 ? 0.3 : 1 }}>
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Página {usPage} de {usTotal.totalPages}</span>
                  <button onClick={() => setUsPage((p) => Math.min(usTotal.totalPages, p + 1))} disabled={usPage === usTotal.totalPages}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: 'var(--ink-2)', background: 'none', border: 'none', cursor: 'pointer', opacity: usPage === usTotal.totalPages ? 0.3 : 1 }}>
                    Siguiente <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Reveal>
    </div>
  )
}

function ErrorBox({ title, message }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'color-mix(in srgb, #E5484D 8%, var(--surface))', border: '1px solid color-mix(in srgb, #E5484D 35%, transparent)', borderRadius: 14, padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, #E5484D 14%, transparent)', color: '#E5484D' }}>
        <AlertTriangle size={19} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4, wordBreak: 'break-word' }}>{message}</div>
      </div>
    </div>
  )
}

function AdminStatCard({ Icon, color, label, value, isMoney, valueColor = 'var(--ink)' }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 22, boxShadow: 'var(--shadow-sm)', transition: 'transform .25s, box-shadow .25s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
        <span style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${color} 13%, transparent)`, color }}><Icon size={19} /></span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: valueColor }}>
        {isMoney
          ? <CountNum value={value} format={(v) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(v)} />
          : <CountNum value={value} />
        }
      </div>
    </div>
  )
}
