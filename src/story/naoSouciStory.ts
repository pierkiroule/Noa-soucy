import type { EffectCue, SceneId, StoryDefinition, TransitionId } from './types'

const scene = (id: SceneId, title: string, text: string, video: string, transitionIn: TransitionId = 'fade') => ({
  type: 'scene' as const,
  id,
  title,
  text,
  duration: 12,
  manualAdvance: true,
  media: { video, fallbackSceneId: id, loopDuration: 12 },
  effects: [] as EffectCue[],
  transitionIn,
  transitionOut: 'ink-wash' as const,
})

const resonance = (title: string, text: string) => ({ title, text })

export const naoSouciStory: StoryDefinition = {
  id: 'nao-souci',
  title: 'La petite noix qui apprit à naviguer sur l’Océan des Soucis',
  subtitle: 'Une histoire à écouter comme on regarde la mer : sans se presser.',
  steps: [
    scene('drift', 'Prologue', `Il y a des histoires que les vieux marins ne racontent qu’une seule fois dans leur vie.
Jamais dans les ports.
Jamais les jours de grand vent.
Ils attendent que la mer retrouve son souffle.
Alors seulement, ils parlent.
Non pour être crus.
Mais parce que certaines histoires continuent de voyager longtemps après que les mots se sont tus.
Celle-ci m’a été confiée au lendemain d’une grande tempête.
Libre à vous de penser qu’elle rêve encore, quelque part, entre deux vagues.
Car la mer ne révèle jamais tout.
Elle laisse toujours une part du voyage…
et parfois un grain de sel sur les lèvres de celui qui écoute.`, '/story/drift.mp4'),
    scene('drift', 'Acte I — La rencontre', `La nuit avait tout brassé.
Le ciel.
L’eau.
Le sable du silence.
Au lever du jour, il ne restait plus que de longues vagues fatiguées.
Elles rapportaient le monde, morceau par morceau.
Une plume.
Une feuille.
Une branche.
Une odeur de bois mouillé.
Un éclat de lumière.
Et ce silence profond où l’on croit parfois entendre la mer continuer de rêver.
Je laissais ma barque dériver.
Il y a des matins où ramer ferait trop de bruit.
Alors je regardais.
Simplement.
Longtemps.
La mer n’est jamais pressée.
Alors, moi non plus.
C’est ainsi que je l’aperçus.
Ce n’était presque rien.
Une demi-coquille de noix.
Elle apparaissait entre deux vagues.
Puis disparaissait.
Puis revenait.
Comme si la mer hésitait encore à me la confier.
Je ne saurais dire pourquoi je ne l’ai pas quittée des yeux.
Peut-être parce que certaines choses semblent si fragiles qu’on les regarde attentivement. Avant de sentir qu’elles nous regardent, elles aussi.
Une vague passa.
Puis une autre.
Une feuille vint se poser dans la coquille.
Puis une brindille.
Je n’y vis rien d’extraordinaire.
Les grandes histoires commencent souvent ainsi.
Par quelque chose que l’on pourrait facilement laisser passer.
Si, ce matin-là, je n’avais pas pris le temps de regarder.`, '/story/drift.mp4'),
    scene('drift', 'Acte II — Les présents de la mer', `Le lendemain, je revins.
Puis le jour d’après.
La petite coquille était toujours là.
Jamais tout à fait au même endroit.
Jamais tout à fait ailleurs.
La mer semblait désormais la reconnaître.
Elle ne la poussait plus.
Elle la portait.
Chaque vague arrivait les mains pleines.
Une mousse légère.
Une poignée de sable.
Une plume plus blanche que l’écume.
Une feuille polie par l’eau.
Puis plus rien.
Comme si le silence faisait lui aussi partie du voyage.
Je restais là, à regarder la mer travailler.
Jamais vite.
Jamais deux fois de la même manière.
Il me semblait parfois qu’elle construisait quelque chose.
La vague suivante me faisait aussitôt douter.
Les vieux marins se méfient des certitudes.
Elles flottent moins longtemps que les coquilles de noix.
Le soleil séchait ce que la nuit avait mouillé.
L’écume venait.
Puis repartait.
Encore.
Et encore.
Je ne savais plus si la mer jouait…
ou si elle prenait soin.
Puis, un matin, je remarquai quelque chose.
Au creux de la coquille, entre la feuille et la brindille, reposait une toute petite graine.
Elle n’était peut-être là que par hasard.
Mais les vieux marins savent que le hasard aime parfois travailler en secret.
Je ne la touchai pas.
Certaines choses poussent mieux lorsqu’on leur laisse le temps de choisir elles-mêmes leur histoire.`, '/story/drift.mp4'),
    { type: 'pause', id: 'ocean-resonance', title: 'Question I', question: 'La mer avait confié plusieurs présents à la petite coquille. Mais parfois, un seul appelle davantage notre regard. Lequel voyez-vous en premier ?', helperText: 'Choisissez celui qui attire votre regard.', maxChoices: 1, allowSkip: false, options: [
      { id: 'seed', label: 'Une graine', params: { growthSpeed: 1.1 }, resonance: resonance('Résonance I — La graine', `Il existe des graines qui traversent des mers entières sans le savoir.
Elles dorment.
Elles attendent.
Puis, un jour, quelque chose les invite à s’ouvrir.
On croit souvent que la force fait naître la vie.
Il arrive pourtant qu’un simple endroit où se déposer suffise.`) },
      { id: 'leaf', label: 'Une feuille', params: { horizontalDrift: .35 }, resonance: resonance('Résonance II — La feuille', `Les feuilles ne tombent jamais toutes de la même manière.
Certaines dansent.
D’autres hésitent.
Quelques-unes semblent connaître l’endroit où elles vont se poser.
Elles ne cherchent pas à retenir l’arbre.
Elles poursuivent simplement leur voyage autrement.`) },
      { id: 'twig', label: 'Une brindille', params: { stability: .9 }, resonance: resonance('Résonance III — La brindille', `Une brindille paraît bien légère.
Pourtant, il suffit parfois d’un appui presque invisible pour empêcher tout un monde de glisser.
Les plus petits soutiens ne demandent pas qu’on les remarque.
Ils demeurent là.
Juste assez longtemps pour que quelque chose puisse tenir.`) },
    ] },
    scene('growth', 'Acte III — Ce qui s’éveille', `Je revins encore.
Puis bien d’autres jours.
Je ne les comptais plus.
La mer, elle non plus.
La petite coquille poursuivait sa route.
Parfois si lentement qu’on l’aurait crue immobile.
Parfois je la perdais de vue.
Puis elle revenait.
Comme certaines pensées qui savent toujours nous retrouver.
Une nuit, la pluie tomba.
Pas celle qui frappe.
Celle qui chuchote.
Au matin, la feuille retenait encore quelques perles d’eau.
La mousse semblait plus douce.
La terre avait pris l’odeur des choses qui commencent.
Je m’approchai.
Très doucement.
La mer n’est jamais pressée.
Alors, moi non plus.
Au fond de la coquille, la graine s’était entrouverte.
À peine.
Comme un secret qui hésite encore à devenir une parole.
Je retins mon souffle.
Il existe des commencements qui demandent moins de lumière que de silence.
Les jours suivants, une racine chercha son chemin.
Elle ne descendait pas.
Elle tâtonnait.
Comme si elle demandait la permission à chaque grain de terre.
Puis vint une pousse.
Si fragile qu’un regard trop rapide aurait pu l’oublier.
Je me surpris à sourire.
Non parce que je comprenais.
Mais parce que je ne comprenais plus.
Et cela faisait longtemps que cela ne m’était pas arrivé.`, '/story/growth.mp4', 'paper-dissolve'),
    { type: 'pause', id: 'resource-resonance', title: 'Question II', question: 'Qu’est-ce qui accompagne le mieux ce qui commence à grandir ?', helperText: 'Choisissez ce qui vous semble juste.', maxChoices: 1, allowSkip: false, options: [
      { id: 'light', label: 'La lumière', params: { lightIntensity: 1 }, resonance: resonance('Résonance IV — La lumière', `La lumière ne pousse rien.
Elle révèle.
Elle montre doucement ce qui était déjà là.
Certaines aurores n’éclairent pas davantage le monde.
Elles nous apprennent seulement à le regarder autrement.`) },
      { id: 'rain', label: 'La pluie', params: { fogDensity: .35 }, resonance: resonance('Résonance V — La pluie', `La pluie ne choisit pas où tomber.
Elle offre la même fraîcheur aux pierres, aux fleurs, aux chemins et à la mer.
Puis elle disparaît.
Comme si nourrir le monde ne demandait aucun remerciement.`) },
      { id: 'wind', label: 'Le vent', params: { windIntensity: .75 }, resonance: resonance('Résonance VI — Le vent', `Le vent ne garde rien.
Il passe.
Il effleure.
Il repart.
Pourtant, combien de voyages n’auraient jamais commencé sans un souffle presque imperceptible ?`) },
    ] },
    scene('growth', 'Acte IV — La fleur', `Il est des matins où l’on croit retrouver le monde.
Et d’autres où l’on découvre qu’il a continué de grandir sans nous.
Chaque jour, la pousse gagnait la hauteur d’un souffle.
Jamais davantage.
Jamais moins.
Les vagues la saluaient sans la bousculer.
Le vent passait doucement, comme s’il avait peur de réveiller quelque chose.
Puis, un matin, la lumière s’arrêta.
Pas dans le ciel.
Sur la coquille.
Une couleur venait d’apparaître.
Si discrète qu’elle semblait hésiter à exister.
Le lendemain, elle était encore là.
Puis vint un pétale.
Puis un autre.
Jusqu’à ce qu’une fleur de souci ouvre enfin son visage au-dessus de la mer.
Je restai longtemps sans parler.
Je n’avais jamais vu une fleur pousser sur une embarcation.
Et pourtant, cela paraissait être la chose la plus naturelle du monde.
Les pétales accueillaient la lumière.
Les feuilles retenaient les gouttes.
Les racines serraient doucement la terre.
Tout semblait à sa place.
Comme si chaque élément connaissait depuis toujours la part qu’il avait à offrir.
Le vent revint.
La fleur s’inclina.
Très légèrement.
Et, pour la première fois, il me sembla que la petite coquille ne suivait plus seulement les vagues.
Elle commençait à répondre au vent.`, '/story/growth.mp4'),
    { type: 'pause', id: 'navigation-resonance', title: 'Question III', question: 'Le vent s’était levé. Doucement. Qu’est-ce qui guidait désormais la petite coquille ?', helperText: 'Choisissez votre direction.', maxChoices: 1, allowSkip: false, options: [
      { id: 'horizon', label: 'L’horizon', params: { horizontalDrift: .7 }, resonance: resonance('Résonance VII — L’horizon', `L’horizon n’avance jamais.
Et pourtant, plus on s’en approche, plus il ouvre de nouveaux chemins.
Certaines directions n’existent peut-être pas pour être atteintes.
Seulement pour nous aider à poursuivre.`) },
      { id: 'flower', label: 'La fleur', params: { lightIntensity: .9 }, resonance: resonance('Résonance VIII — La fleur', `Une fleur n’élève jamais la voix.
Elle s’ouvre.
Simplement.
Et cela suffit parfois à changer la lumière autour d’elle.
Il est des présences qui éclairent sans jamais chercher à briller.`) },
      { id: 'waves', label: 'Les vagues', params: { waveIntensity: .65 }, resonance: resonance('Résonance IX — Les vagues', `Aucune vague ne traverse la mer toute seule.
Chacune prolonge la précédente.
Chacune prépare la suivante.
Peut-être en est-il ainsi de toutes les histoires.
Aucune ne s’achève vraiment.
Elles poursuivent simplement leur voyage dans un autre regard.`) },
    ] },
    scene('navigation', 'Acte V — La petite noix qui apprit à naviguer', `Le vent revint.
Pas celui qui arrache.
Celui qui invite.
Il passait entre les pétales comme on tourne les pages d’un livre très ancien.
La mer, elle aussi, avait changé.
Elle ne poussait plus.
Elle accompagnait.
Alors quelque chose se produisit.
Presque rien.
La petite coquille changea de direction.
À peine.
Comme un oiseau qui découvre le ciel sans savoir encore qu’il est en train de voler.
Je ne touchai pas aux rames.
Il existe des voyages que l’on dérange à vouloir les conduire.
La mer n’est jamais pressée.
Alors, moi non plus.
La petite embarcation s’éloignait.
Jamais tout droit.
Jamais tout à fait au hasard.
Elle semblait écouter ce que le vent disait à la mer…
et ce que la mer gardait pour elle.
Puis vint le matin où je ne la retrouvai plus.
Je cherchai entre deux vagues.
Dans les reflets.
Au loin.
Rien.
Seulement la mer.
Le ciel.
Et cette impression étrange que quelque chose continuait pourtant son chemin.
Depuis ce jour, je retourne souvent au lendemain des tempêtes.
Les jeunes marins pensent que j’attends les poissons.
Je les laisse croire.
Lorsqu’un enfant me demande ce qu’est devenue la petite coquille, je réponds toujours la même chose :
Je ne sais pas.
Les histoires qui trouvent leur route n’ont plus besoin des vieux marins.
Elles poursuivent leur voyage dans le regard de ceux qui les accueillent.
Certains disent qu’il arrive encore d’apercevoir une minuscule voile orangée entre deux vagues.
Ils lui ont donné un nom.
Nao Souci.`, '/story/navigation.mp4', 'paper-dissolve'),
    { type: 'ending', id: 'shore', title: 'Épilogue', text: `Si un jour, au lendemain d’une tempête, vous apercevez quelque chose de minuscule flotter au milieu de l’immensité…
ne vous pressez pas.
Les grandes histoires n’aiment pas courir.
Elles préfèrent dériver.
Longtemps.
Jusqu’à rencontrer un regard assez calme pour leur faire une place.
Alors peut-être verrez-vous, vous aussi, une petite coquille de noix apprendre à naviguer.
Et si cela arrive, gardez cette histoire quelque temps au fond de vous.
Attendez.
Que le vent se calme.
Que la mer retrouve son souffle.
Les vieux marins disent que c’est ainsi que les histoires continuent de voyager.` },
  ],
}
