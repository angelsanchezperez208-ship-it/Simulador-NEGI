import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { getResumen } from '../../api/reportes'
import { getUsuarios, cambiarRol, eliminarUsuario } from '../../api/usuarios'
import { formatCurrency } from '../../lib/utils'
import Spinner from '../../components/Spinner'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'

const CHART_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899']

export default function AdminPanel() {
  const { usuario } = useAuth()
  const [resumen, setResumen] = useState(null)
  const [loadingResumen, setLoadingResumen] = useState(true)

  const [usuarios, setUsuarios] = useState([])
  const [usPage, setUsPage] = useState(1)
  const [usTotal, setUsTotal] = useState({ total: 0, totalPages: 1 })
  const [loadingUs, setLoadingUs] = useState(true)

  useEffect(() => {
    getResumen(usuario.token)
      .then(setResumen)
      .catch(() => toast.error('Error al cargar resumen'))
      .finally(() => setLoadingResumen(false))
  }, [usuario.token])

  useEffect(() => {
    setLoadingUs(true)
    getUsuarios(usuario.token, usPage, 8)
      .then((data) => {
        setUsuarios(data.usuarios || data)
        setUsTotal({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 })
      })
      .catch(() => toast.error('Error al cargar usuarios'))
      .finally(() => setLoadingUs(false))
  }, [usuario.token, usPage])

  const handleCambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'estudiante' : 'admin'
    try {
      await cambiarRol(id, nuevoRol, usuario.token)
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, rol: nuevoRol } : u))
      )
      toast.success(`Rol cambiado a ${nuevoRol}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return
    try {
      await eliminarUsuario(id, usuario.token)
      setUsuarios((prev) => prev.filter((u) => u._id !== id))
      toast.success('Usuario eliminado')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const chartData = resumen?.por_escenario
    ? Object.entries(resumen.por_escenario).map(([nombre, count], i) => ({
        nombre,
        count,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }))
    : []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-100">Panel de Administración</h1>

      {/* Stats */}
      {loadingResumen ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : resumen ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total usuarios" value={resumen.total_usuarios ?? '—'} />
          <StatCard label="Total simulaciones" value={resumen.total_simulaciones ?? '—'} />
          <StatCard
            label="Utilidad promedio"
            value={resumen.utilidad_promedio != null ? formatCurrency(resumen.utilidad_promedio) : '—'}
            valueClass={
              resumen.utilidad_promedio >= 0 ? 'text-emerald-400' : 'text-red-400'
            }
          />
        </div>
      ) : null}

      {/* Gráfica por escenario */}
      {chartData.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-300 mb-4">
            Simulaciones por escenario
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={36}>
              <XAxis dataKey="nombre" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                formatter={(v) => [v, 'Simulaciones']}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-3">Usuarios</h2>
        {loadingUs ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-5 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">Nombre</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">Email</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">Rol</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u._id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3 text-slate-200 font-medium">{u.nombre}</td>
                      <td className="px-5 py-3 text-slate-400 text-xs">{u.email}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleCambiarRol(u._id, u.rol)}
                          disabled={u._id === usuario._id}
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            u.rol === 'admin'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {u.rol}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleEliminar(u._id)}
                          disabled={u._id === usuario._id}
                          className="text-slate-600 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {usTotal.totalPages > 1 && (
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => setUsPage((p) => Math.max(1, p - 1))}
                  disabled={usPage === 1}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-100 disabled:opacity-30"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <span className="text-xs text-slate-500">
                  Página {usPage} de {usTotal.totalPages}
                </span>
                <button
                  onClick={() => setUsPage((p) => Math.min(usTotal.totalPages, p + 1))}
                  disabled={usPage === usTotal.totalPages}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-100 disabled:opacity-30"
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, valueClass = 'text-slate-100' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">{label}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}
