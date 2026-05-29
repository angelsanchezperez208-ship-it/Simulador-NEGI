import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { usuario } = useAuth()

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0">
      <span className="font-bold text-emerald-500 tracking-tight text-lg">
        Simulador NEGI
      </span>
      {usuario && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">{usuario.nombre}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              usuario.rol === 'admin'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {usuario.rol}
          </span>
        </div>
      )}
    </header>
  )
}
