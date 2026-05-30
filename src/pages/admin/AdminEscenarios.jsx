import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Edit2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEscenarios, updateEscenario, createEscenario } from '../../api/escenarios'
import { formatCurrency } from '../../lib/utils'
import { Reveal } from '../../components/ui'
import Spinner from '../../components/Spinner'

const emptyForm = {
  nombre: '',
  descripcion: '',
  tipo_cambio: '',
  arancel: '',
  costo_logistico_mxn: '',
  activo: true,
}

const inputStyle = {
  width: '100%',
  background: 'var(--input-bg)',
  border: '1.5px solid var(--line-strong)',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 14,
  color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color .2s',
  boxSizing: 'border-box',
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
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)' }}>Escenarios</h1>
          <button
            onClick={abrirCreacion}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-brand)', transition: 'opacity .2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            <Plus size={15} /> Nuevo escenario
          </button>
        </div>
      </Reveal>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {escenarios.map((esc, i) => (
            <Reveal key={esc._id} delay={i * 40}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--ink)' }}>{esc.nombre}</p>
                      <span style={{
                        fontSize: 10.5, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                        background: esc.activo ? 'color-mix(in srgb, #16A34A 14%, transparent)' : 'var(--surface-2)',
                        color: esc.activo ? '#16A34A' : 'var(--muted)',
                        border: `1px solid ${esc.activo ? 'color-mix(in srgb, #16A34A 30%, transparent)' : 'var(--line)'}`,
                      }}>
                        {esc.activo ? 'activo' : 'inactivo'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }}>{esc.descripcion}</p>
                    <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--ink-2)', flexWrap: 'wrap' }}>
                      <span>T/C: <strong style={{ color: 'var(--ink)' }}>${parseFloat(esc.tipo_cambio).toFixed(2)}</strong></span>
                      <span>Arancel: <strong style={{ color: 'var(--ink)' }}>{esc.arancel}%</strong></span>
                      <span>Logística: <strong style={{ color: 'var(--ink)' }}>{formatCurrency(esc.costo_logistico_mxn)}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => toggleActivo(esc)}
                      style={{ fontSize: 12.5, padding: '6px 14px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--surface-2)', color: 'var(--ink-2)', cursor: 'pointer', fontWeight: 600, transition: 'all .2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-2)' }}
                    >
                      {esc.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => abrirEdicion(esc)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, padding: '6px 14px', borderRadius: 8, border: '1.5px solid color-mix(in srgb, var(--brand) 35%, transparent)', background: 'color-mix(in srgb, var(--brand) 10%, transparent)', color: 'var(--brand)', cursor: 'pointer', fontWeight: 700, transition: 'all .2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--brand) 18%, transparent)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--brand) 10%, transparent)' }}
                    >
                      <Edit2 size={12} /> Editar
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Form — edit or create */}
      {(editando || creando) && (
        <Reveal>
          <div style={{ background: 'var(--surface)', border: '1.5px solid color-mix(in srgb, var(--brand) 35%, transparent)', borderRadius: 16, padding: 26, boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>
              {creando ? 'Nuevo escenario' : 'Editar escenario'}
            </h2>
            <form onSubmit={handleGuardar}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                <Field label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
                <Field label="Tipo de cambio" name="tipo_cambio" type="number" step="0.01" value={form.tipo_cambio} onChange={handleChange} required />
                <Field label="Arancel (%)" name="arancel" type="number" step="0.01" value={form.arancel} onChange={handleChange} required />
                <Field label="Costo logístico (MXN)" name="costo_logistico_mxn" type="number" step="0.01" value={form.costo_logistico_mxn} onChange={handleChange} required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6 }}>Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={2}
                  style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ink-2)', marginBottom: 20, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--brand)', width: 16, height: 16 }}
                />
                Activo
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: 'var(--brand)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, boxShadow: 'var(--shadow-brand)', transition: 'opacity .2s' }}
                >
                  {saving && <Spinner />}
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={cancelar}
                  style={{ padding: '10px 22px', background: 'var(--surface-2)', color: 'var(--ink-2)', fontWeight: 600, fontSize: 14, borderRadius: 10, border: '1px solid var(--line-strong)', cursor: 'pointer', transition: 'all .2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-2)' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}
    </div>
  )
}

function Field({ label, name, ...rest }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6 }}>{label}</label>
      <input
        name={name}
        style={inputStyle}
        onFocus={(e) => { e.target.style.borderColor = 'var(--brand)' }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--line-strong)' }}
        {...rest}
      />
    </div>
  )
}
