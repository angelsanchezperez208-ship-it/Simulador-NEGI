export const NIVELES = [
  { nivel: 1, xpMin: 0, xpNext: 50, rank: 'Novato' },
  { nivel: 2, xpMin: 50, xpNext: 150, rank: 'Aprendiz' },
  { nivel: 3, xpMin: 150, xpNext: 300, rank: 'Comerciante' },
  { nivel: 4, xpMin: 300, xpNext: 500, rank: 'Exportador' },
  { nivel: 5, xpMin: 500, xpNext: 750, rank: 'Exportador Avanzado' },
  { nivel: 6, xpMin: 750, xpNext: 1050, rank: 'Estratega Global' },
  { nivel: 7, xpMin: 1050, xpNext: 1400, rank: 'Empresario' },
  { nivel: 8, xpMin: 1400, xpNext: 1800, rank: 'Magnate' },
  { nivel: 9, xpMin: 1800, xpNext: 2500, rank: 'Visionario' },
  { nivel: 10, xpMin: 2500, xpNext: Infinity, rank: 'Leyenda NEGI' },
]

export function getNivelFromXP(xp) {
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (xp >= NIVELES[i].xpMin) return NIVELES[i]
  }
  return NIVELES[0]
}

export function calcXpProgress(xp) {
  const nivel = getNivelFromXP(xp)
  if (nivel.xpNext === Infinity) return 100
  const progreso = xp - nivel.xpMin
  const rango = nivel.xpNext - nivel.xpMin
  return Math.round((progreso / rango) * 100)
}
