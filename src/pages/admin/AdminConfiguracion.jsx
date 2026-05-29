import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { getConfiguracion, updateConfiguracion } from '../../api/configuracion'
import Spinner from '../../components/Spinner'

const CLAVES = [
  { clave: 'tipo_cambio_base', label: 'Tipo de cambio base (MXN/USD)', step: '0.01' },
  { clave: 'volumen_maximo', label: 'Volumen máximo de unidades', step: '1' },
  { clave: 'precio_usd_maximo', label: 'Precio USD máximo', step: '0.01' },
]

export default function AdminConfiguracion() {
  const { usuario } = useAuth()
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [editValues, setEditValues] = useState({})

  useEffect(() => {
    getConfiguracion(usuario.token)
      .then((data) => {
        const map = {}
        const edits = {}
        ;(Array.isArray(data) ? data : Object.entries(data).map(([clave, valor]) => ({ clave, valor }))).forEach(
          (item) => {
            map[item.clave] = item.valor
            edits[item.clave] = String(item.valor)
          }
        )
        setConfig(map)
        setEditValues(edits)
      })
      .catch(() => toast.error('Error al cargar configuración'))
      .finally(() => setLoading(false))
  }, [usuario.token])

  const handleChange = (clave, value) => {
    setEditValues((prev) => ({ ...prev, [clave]: value }))
  }

  const handleGuardar = async (clave) => {
    setSaving((prev) => ({ ...prev, [clave]: true }))
    try {
      await updateConfiguracion(clave, parseFloat(editValues[clave]), usuario.token)
      setConfig((prev) => ({ ...prev, [clave]: parseFloat(editValues[clave]) }))
      toast.success('Configuración actualizada')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving((prev) => ({ ...prev, [clave]: false }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Configuración global</h1>
        <p className="text-slate-400 text-sm mt-1">
          Parámetros que afectan el comportamiento del simulador para todos los usuarios.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="space-y-4">
          {CLAVES.map(({ clave, label, step }) => (
            <div
              key={clave}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <label className="block text-sm font-medium text-slate-300 mb-3">{label}</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  step={step}
                  min="0"
                  value={editValues[clave] ?? ''}
                  onChange={(e) => handleChange(clave, e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                />
                <button
                  onClick={() => handleGuardar(clave)}
                  disabled={saving[clave] || String(editValues[clave]) === String(config[clave])}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
                >
                  {saving[clave] ? <Spinner className="h-4 w-4" /> : null}
                  Guardar
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Valor actual: <span className="text-slate-400">{config[clave] ?? '—'}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
