import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getHistorial } from '../api/simulaciones'
import { formatCurrency, formatDate } from '../lib/utils'
import Spinner from '../components/Spinner'

export default function Historial() {
  const { usuario } = useAuth()
  const [data, setData] = useState({ simulaciones: [], total: 0, page: 1, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getHistorial(usuario.token, page, 10)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [usuario.token, page])

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Historial de simulaciones</h1>
        <p className="text-slate-400 text-sm mt-1">
          {data.total} simulación{data.total !== 1 ? 'es' : ''} en total
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : data.simulaciones.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium mb-2">Sin simulaciones aún</p>
          <Link to="/simulador" className="text-emerald-400 hover:text-emerald-300 text-sm">
            Corre tu primera simulación →
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">
                    Fecha
                  </th>
                  <th className="text-left px-5 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">
                    Escenario
                  </th>
                  <th className="text-right px-5 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">
                    Utilidad neta
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.simulaciones.map((s) => {
                  const utilidad = parseFloat(s.resultados?.utilidad_neta ?? 0)
                  return (
                    <tr
                      key={s._id}
                      className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-slate-400 text-xs">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-200">
                        {s.escenario?.nombre || '—'}
                      </td>
                      <td
                        className={`px-5 py-3 text-right font-semibold ${
                          utilidad >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatCurrency(utilidad)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/simulacion/${s._id}`}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          Ver detalle →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <span className="text-xs text-slate-500">
                Página {page} de {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
