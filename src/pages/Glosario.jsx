import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

const terminos = [
  {
    term: 'Tipo de cambio',
    def: 'Precio al que se intercambia una moneda por otra. En este simulador, es la cantidad de pesos mexicanos (MXN) que equivalen a un dólar estadounidense (USD).',
  },
  {
    term: 'Arancel',
    def: 'Impuesto que un país cobra sobre las importaciones de bienes. Se expresa como un porcentaje del valor de la mercancía. Un mayor arancel encarece el producto en el mercado destino.',
  },
  {
    term: 'TMEC (T-MEC)',
    def: 'Tratado entre México, Estados Unidos y Canadá. Permite que muchos productos mexicanos entren a EE.UU. y Canadá con arancel preferencial (generalmente 0%), sustituyó al TLCAN en 2020.',
  },
  {
    term: 'NMF — Nación Más Favorecida',
    def: 'Principio de la OMC por el cual un país debe otorgar a todos sus socios comerciales el mismo trato arancelario que concede a su "nación más favorecida". Es el arancel estándar cuando no existe un tratado preferencial.',
  },
  {
    term: 'Costo logístico',
    def: 'Gastos asociados al transporte, almacenamiento, seguros y trámites aduanales de la mercancía. Varía según el destino y el tipo de escenario económico.',
  },
  {
    term: 'Comisiones',
    def: 'Pagos a intermediarios, agentes de ventas o distribuidores que participan en la operación de exportación. Son costos variables que reducen la utilidad neta.',
  },
  {
    term: 'Utilidad neta',
    def: 'Ganancia real después de restar todos los costos (producción, logística, arancel, comisiones) al ingreso total de la venta. Si es negativa, la operación genera pérdida.',
  },
  {
    term: 'Depreciación (tipo de cambio)',
    def: 'Cuando la moneda local (MXN) pierde valor frente al dólar. Para el exportador mexicano esto puede ser favorable, ya que recibe más pesos por cada dólar que cobra.',
  },
  {
    term: 'Apreciación (tipo de cambio)',
    def: 'Cuando la moneda local (MXN) gana valor frente al dólar. Para el exportador mexicano esto puede reducir su ingreso en pesos, ya que cada dólar cobra menos pesos.',
  },
  {
    term: 'Riesgo cambiario',
    def: 'Incertidumbre sobre el valor futuro del tipo de cambio. Una variación inesperada puede mejorar o empeorar los resultados financieros de una operación de exportación.',
  },
]

export default function Glosario() {
  const [open, setOpen] = useState(null)

  const toggle = (i) => setOpen((prev) => (prev === i ? null : i))

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Glosario</h1>
        <p className="text-slate-400 text-sm mt-1">
          Definiciones de términos clave en comercio exterior.
        </p>
      </div>

      <div className="space-y-2">
        {terminos.map((t, i) => (
          <div
            key={t.term}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
            >
              <span className="font-medium text-slate-100 text-sm">{t.term}</span>
              <ChevronDown
                size={16}
                className={cn(
                  'text-slate-500 transition-transform shrink-0',
                  open === i && 'rotate-180'
                )}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <p className="text-slate-400 text-sm leading-relaxed">{t.def}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
