export interface MetaphoricResonance {
  id: string
  word: string
  text: string
  position: { x: number; y: number }
  drift: { x: number; y: number; duration: number; delay: number }
}

export const metaphoricResonances: MetaphoricResonance[] = [
  { id: 'brouillard', word: 'Brouillard', text: 'Le brouillard n’empêche pas d’avancer.\nIl invite simplement à marcher moins vite.\nLe prochain pas suffit parfois.', position: { x: 16, y: 30 }, drift: { x: 14, y: -10, duration: 26, delay: -4 } },
  { id: 'ancre', word: 'Ancre', text: 'Une ancre ne sert pas à rester immobile.\nElle permet de traverser la tempête\nsans se perdre.', position: { x: 72, y: 26 }, drift: { x: -12, y: 12, duration: 28, delay: -12 } },
  { id: 'graine', word: 'Graine', text: 'Tout ne demande pas d’être résolu.\nCertaines choses ont seulement besoin\nde temps et d’un peu de lumière.', position: { x: 48, y: 20 }, drift: { x: 10, y: 14, duration: 30, delay: -8 } },
  { id: 'souffle', word: 'Souffle', text: 'Il existe des moments\noù respirer est déjà\nune manière d’avancer.', position: { x: 30, y: 48 }, drift: { x: -10, y: 10, duration: 24, delay: -2 } },
  { id: 'maree', word: 'Marée', text: 'Ce qui s’éloigne aujourd’hui\npeut revenir autrement demain.', position: { x: 65, y: 47 }, drift: { x: 12, y: -8, duration: 27, delay: -15 } },
  { id: 'echo', word: 'Écho', text: 'Certaines paroles continuent de vivre\nlongtemps après avoir été prononcées.', position: { x: 86, y: 42 }, drift: { x: -10, y: -12, duration: 25, delay: -6 } },
  { id: 'rocher', word: 'Rocher', text: 'Résister n’est pas toujours se raidir.\nParfois, c’est simplement\nrester présent.', position: { x: 12, y: 62 }, drift: { x: 13, y: 8, duration: 29, delay: -18 } },
  { id: 'horizon', word: 'Horizon', text: 'L’horizon recule à mesure que l’on avance.\nC’est peut-être pour cela\nqu’il nous met en mouvement.', position: { x: 50, y: 63 }, drift: { x: -14, y: -9, duration: 31, delay: -10 } },
  { id: 'phare', word: 'Phare', text: 'Un phare ne supprime pas la nuit.\nIl rappelle seulement\nqu’une direction reste possible.', position: { x: 82, y: 65 }, drift: { x: 9, y: 12, duration: 24, delay: -14 } },
  { id: 'courant', word: 'Courant', text: 'On ne choisit pas toujours le courant.\nMais on peut parfois ajuster\nla manière de le traverser.', position: { x: 23, y: 78 }, drift: { x: -8, y: -12, duration: 26, delay: -7 } },
  { id: 'rivage', word: 'Rivage', text: 'Un rivage est à la fois\nune fin, un refuge\net le début d’un autre départ.', position: { x: 58, y: 82 }, drift: { x: 10, y: -10, duration: 28, delay: -3 } },
  { id: 'derive', word: 'Dérive', text: 'Dériver n’est pas forcément se perdre.\nC’est parfois laisser apparaître\nun chemin imprévu.', position: { x: 76, y: 80 }, drift: { x: -12, y: 8, duration: 30, delay: -19 } },
  { id: 'tempete', word: 'Tempête', text: 'La tempête bouleverse le paysage.\nElle ne décide pas\nde ce qui restera debout.', position: { x: 34, y: 32 }, drift: { x: 8, y: 12, duration: 27, delay: -21 } },
  { id: 'ile', word: 'Île', text: 'Une île peut être un refuge.\nElle peut aussi devenir\nun lieu d’où repartir.', position: { x: 90, y: 24 }, drift: { x: -9, y: 10, duration: 32, delay: -9 } },
  { id: 'trace', word: 'Trace', text: 'Certaines traces disparaissent.\nD’autres restent assez longtemps\npour nous aider à retrouver le chemin.', position: { x: 42, y: 72 }, drift: { x: 12, y: 9, duration: 25, delay: -16 } },
  { id: 'lumiere', word: 'Lumière', text: 'La lumière ne montre pas tout.\nElle révèle parfois seulement\nce qui peut être regardé maintenant.', position: { x: 14, y: 18 }, drift: { x: 10, y: 12, duration: 31, delay: -11 } }
]
