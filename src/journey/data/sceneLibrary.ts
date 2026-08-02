import type { JourneyScene, MovementId } from '../types'

const variants: Record<MovementId, string[]> = {
  opening: ['Quelque part entre la rive et le large, la petite coque de Nao attend. L’eau respire contre le bois.', 'Au bord de l’eau, Nao tient dans le creux du monde. Le large demeure encore silencieux.'],
  embarkation: ['Dans sa coque prennent place {resources}. Rien d’autre n’est requis pour partir.', 'Nao embarque {resources}. La voile se soulève à peine.'],
  departure: ['La rive s’éloigne sans disparaître. Nao quitte lentement ses eaux familières.', 'Une ligne d’eau se glisse entre Nao et la terre. Le départ a déjà commencé.'],
  landscape: ['Voici {landscape}. {landscapeDescription} Nao en reçoit la mesure.', '{landscape} se déploie autour de la coque. {landscapeDescription}'],
  'first-resource': ['Dans la coque, {resourceOne} demeure accessible. Sa présence suffit à modifier un peu la lumière.', 'Sous la voile repose {resourceOne}. Nao la garde près du bord.'],
  deepening: ['La rive n’est plus qu’une ligne. L’eau devient plus profonde et le silence change de poids.', 'Plus loin, le mouvement du large gagne la coque. Nao entre dans la traversée.'],
  passage: ['Un passage se resserre et l’eau frappe plus près. La petite coque avance sans effacer ce qui l’entoure.', 'Le courant se noue autour de Nao. Pendant quelques instants, l’horizon se retire.'],
  'second-resource': ['Alors, {resourceTwo} trouve sa place. Quelque chose dans la coque répond autrement au mouvement.', 'Au cœur du passage reste {resourceTwo}. La voile en reçoit un frémissement.'],
  navigation: ['{navigation} La route se compose au contact de l’eau.', '{navigation} Chaque mouvement laisse apparaître le suivant.'],
  shift: ['Le vent change de côté. Ce qui semblait immobile commence à se déplacer.', 'Une ouverture traverse le paysage. Nao passe d’une eau à l’autre, presque imperceptiblement.'],
  horizon: ['Peu à peu, une ligne plus claire apparaît. Elle ne promet rien ; elle donne au regard une distance.', 'L’horizon revient par fragments. Une lumière basse repose désormais sur l’eau.'],
  'provisional-shore': ['Une rive apparaît. Ce n’est pas la fin du voyage, seulement un lieu où laisser la coque se poser.', 'Nao rejoint une rive provisoire. L’eau poursuit son mouvement, plus loin.'],
}

export const sceneLibrary: JourneyScene[] = Object.entries(variants).flatMap(([movement, texts]) =>
  texts.map((text, index) => ({ id:`${movement}-${index + 1}`, movement:movement as MovementId, durationMs:10000, text:{variants:[text]}, transition:{type:index ? 'drift' : 'fade',durationMs:1200}, weight:1 })),
)
