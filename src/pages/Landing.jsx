import { Link } from 'react-router-dom'
import { Globe, TrendingUp, BarChart2, BookOpen } from 'lucide-react'

const escenarios = [
  { icon: Globe, titulo: 'TMEC', desc: 'Exportación bajo el Tratado México-Estados Unidos-Canadá con arancel preferencial.' },
  { icon: TrendingUp, titulo: 'NMF', desc: 'Nación Más Favorecida: exportación bajo reglas de la OMC a mercados estándar.' },
  { icon: BarChart2, titulo: 'Alta inflación', desc: 'Escenario con tipo de cambio volátil e inflación elevada en el mercado destino.' },
  { icon: BookOpen, titulo: 'Mercado emergente', desc: 'Exportación a economías en desarrollo con mayores aranceles y costos logísticos.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <span className="font-bold text-emerald-500 text-xl tracking-tight">Simulador NEGI</span>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-md hover:bg-slate-800"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/registro"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-4 py-2 rounded-md transition-colors"
          >
            Crear Cuenta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1">
          Universidad Anáhuac Mayab
        </div>
        <h1 className="text-5xl font-extrabold leading-tight max-w-3xl mb-6 tracking-tight">
          Simulador Web de{' '}
          <span className="text-emerald-400">Negocios Internacionales</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
          Practica operaciones de exportación, analiza escenarios económicos reales
          y toma decisiones estratégicas con retroalimentación inmediata.
        </p>
        <div className="flex gap-4">
          <Link
            to="/registro"
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Empezar ahora
          </Link>
          <Link
            to="/login"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      {/* Escenarios */}
      <section className="px-8 pb-20 max-w-5xl mx-auto w-full">
        <h2 className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">
          4 escenarios económicos disponibles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {escenarios.map(({ icon: Icon, titulo, desc }) => (
            <div
              key={titulo}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{titulo}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-5 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Universidad Anáhuac Mayab · Simulador NEGI
      </footer>
    </div>
  )
}
