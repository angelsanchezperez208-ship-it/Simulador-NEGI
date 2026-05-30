import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getHistorial } from '../api/simulaciones'
import { formatCurrency, formatDate } from '../lib/utils'
import { Reveal } from '../components/ui'
import Spinner from '../components/Spinner'

const FILTERS = [['todos', 'Todas'], ['positivas', 'Con ganancia'], ['negativas', 'Con pérdida']]

export default function Historial() {
  const { usuario } = useAuth()
  const [data, setData] = useState({ simulaciones: [], total: 0, page: 1, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    setLoading(true)
    setError('')
    getHistorial(usuario.token, page, 10)
      .then((res) => setData(res))
      .catch((err) => setError(err.message || 'No se pudo cargar el historial'))
      .finally(() => setLoading(false))
  }, [usuario.token, page])

  if (error)
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: 'var(--neg)', marginBottom: 12 }}>{error}</p>
        <Link to="/dashboard" style={{ color: 'var(--brand)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>← Volver al inicio</Link>
      </div>
    )

  const sims = data.simulaciones ?? []
  const filtered = filter === 'todos' ? sims : sims.filter((s) => {
    const u = parseFloat(s.utilidad_mxn ?? 0)
    return filter === 'positivas' ? u >= 0 : u < 0
  })

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <Reveal>
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Historial de simulaciones</h1>
            <p style={{ color: 'var(--muted)', fontSize: 16, marginTop: 8 }}>{data.total} simulaciones en total</p>
          </div>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={80}>
          <div style={{ display: 'flex', gap: 6, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 99, padding: 5 }}>
            {FILTERS.map(([k, lbl]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ padding: '8px 16px', borderRadius: 99, fontSize: 13.5, fontWeight: 700, color: filter === k ? '#fff' : 'var(--ink-2)', background: filter === k ? 'var(--brand)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all .2s' }}>
                {lbl}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sin simulaciones aún</p>
          <Link to="/simulador" style={{ color: 'var(--brand)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Corre tu primera simulación →
          </Link>
        </div>
      ) : (
        <>
          <Reveal delay={120}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {/* Table head */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr auto', padding: '14px 22px', borderBottom: '1px solid var(--line)', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                <span>Escenario</span>
                <span>Fecha</span>
                <span style={{ textAlign: 'right' }}>Utilidad neta</span>
                <span style={{ width: 100 }} />
              </div>

              {filtered.map((s, i) => {
                const utilidad = parseFloat(s.utilidad_mxn ?? 0)
                return (
                  <div
                    key={s.id}
                    style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr auto', alignItems: 'center', padding: '16px 22px', borderBottom: i < filtered.length - 1 ? '1px solid var(--line)' : 'none', transition: 'background .2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{s.snap_nombre_escenario || '—'}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{formatDate(s.created_at)}</span>
                    <span style={{ textAlign: 'right', fontWeight: 800, fontSize: 15.5, color: utilidad >= 0 ? '#16A34A' : '#E5484D' }}>
                      {formatCurrency(utilidad)}
                    </span>
                    <div style={{ width: 100, textAlign: 'right' }}>
                      <Link to={`/simulacion/${s.id}`} style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--brand)', textDecoration: 'none' }}>
                        Ver detalle →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: page === 1 ? 'var(--muted)' : 'var(--ink-2)', background: 'none', border: 'none', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={16} /> Anterior
              </button>
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Página {page} de {data.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: page === data.totalPages ? 'var(--muted)' : 'var(--ink-2)', background: 'none', border: 'none', cursor: page === data.totalPages ? 'not-allowed' : 'pointer', opacity: page === data.totalPages ? 0.4 : 1 }}>
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
