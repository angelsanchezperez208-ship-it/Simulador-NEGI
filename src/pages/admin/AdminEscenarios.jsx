import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Edit2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEscenarios, updateEscenario, createEscenario } from '../../api/escenarios'
import { formatCurrency } from '../../lib/utils'
import Spinner from '../../components/Spinner'

const emptyForm = {
  nombre: '',
  descripcion: '',
  tipo_cambio: '',
  arancel: '',
  costo_logistico_mxn: '',
  activo: true,
}

export default function AdminEscenarios() {
  const { usuario } = useAuth()
  const [escenarios, setEscenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    getEscenarios(usuario.token)
      .then((data) => setEscenarios(Array.isArray(data) ? data : data.escenarios || []))
      .catch(() => toast.error('Error al cargar escenarios'))
      .finally(() => setLoading(false))
  }, [usuario.token])

  const abrirEdicion = (esc) => {
    setCreando(false)
    setEditando(esc._id)
    setForm({
      nombre: esc.nombre,
      descripcion: esc.descripcion,
      tipo_cambio: esc.tipo_cambio,
      arancel: esc.arancel,
      costo_logistico_mxn: esc.costo_logistico_mxn,
      activo: esc.activo ?? true,
    })
  }

  const abrirCreacion = () => {
    setEditando(null)
    setCreando(true)
    setForm(emptyForm)
  }

  const cancelar = () => {
    setEditando(null)
    setCreando(false)
    setForm(emptyForm)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        tipo_cambio: parseFloat(form.tipo_cambio),
        arancel: parseFloat(form.arancel),
        costo_logistico_mxn: parseFloat(form.costo_logistico_mxn),
      }
      if (creando) {
        const nuevo = await createEscenario(payload, usuario.token)
        setEscenarios((prev) => [...prev, nuevo])
        toast.success('Escenario creado')
      } else {
        const actualizado = await updateEscenario(editando, payload, usuario.token)
        setEscenarios((prev) => prev.map((e) => (e._id === editando ? actualizado : e)))
        toast.success('Escenario actualizado')
      }
      cancelar()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActivo = async (esc) => {
    try {
      const actualizado = await updateEscenario(esc._id, { activo: !esc.activo }, usuario.token)
      setEscenarios((prev) => prev.map((e) => (e._id === esc._id ? actualizado : e)))
      toast.success(`Escenario ${!esc.activo ? 'activado' : 'desactivado'}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Escenarios</h1>
        <button
          onClick={abrirCreacion}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={15} /> Nuevo escenario
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {escenarios.map((esc) => (
            <div
              key={esc._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-100">{esc.nombre}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                        esc.activo
                          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                          : 'text-slate-500 border-slate-700 bg-slate-800'
                      }`}
                    >
                      {esc.activo ? 'activo' : 'inactivo'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mb-3">{esc.descripcion}</p>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span>T/C: <strong className="text-slate-200">${parseFloat(esc.tipo_cambio).toFixed(2)}</strong></span>
                    <span>Arancel: <strong className="text-slate-200">{esc.arancel}%</strong></span>
                    <span>Logística: <strong className="text-slate-200">{formatCurrency(esc.costo_logistico_mxn)}</strong></span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleActivo(esc)}
                    className="text-xs text-slate-400 hover:text-slate-100 border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-md transition-colors"
                  >
                    {esc.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => abrirEdicion(esc)}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario edición / creación */}
      {(editando || creando) && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-4">
            {creando ? 'Nuevo escenario' : 'Editar escenario'}
          </h2>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
              <Field label="Tipo de cambio" name="tipo_cambio" type="number" step="0.01" value={form.tipo_cambio} onChange={handleChange} required />
              <Field label="Arancel (%)" name="arancel" type="number" step="0.01" value={form.arancel} onChange={handleChange} required />
              <Field label="Costo logístico (MXN)" name="costo_logistico_mxn" type="number" step="0.01" value={form.costo_logistico_mxn} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                className="accent-emerald-500"
              />
              Activo
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
              >
                {saving ? <Spinner className="h-4 w-4" /> : null}
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={cancelar}
                className="border border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500 px-5 py-2 rounded-md text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({ label, name, ...rest }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        name={name}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
        {...rest}
      />
    </div>
  )
}
