const introText = `Nous traversons tous des périodes où le vent change, où l’horizon disparaît, où nous ne savons plus très bien dans quelle direction avancer.

Personne ne choisit les tempêtes.

Mais chacun apprend, peu à peu, sa manière de les traverser.

Cette boussole ne cherche pas à dire qui vous êtes.

Elle vous invite simplement à découvrir les compétences de navigation que vous utilisez déjà, parfois sans même vous en rendre compte.

Pour chaque phrase, choisissez une note de 1 à 5.

1 = Pas du tout comme moi
2 = Un peu comme moi
3 = Parfois comme moi
4 = Souvent comme moi
5 = Tout à fait comme moi

La forme obtenue n’est ni bonne ni mauvaise.

Elle représente simplement votre manière de naviguer aujourd’hui.`

export function CompassIntro({ onStart, onBack }: { onStart:()=>void; onBack:()=>void }) {
  return <section className="compass-panel compass-intro"><span className="eyebrow">Module facultatif</span><h1>Guide projectif des navigateurs de l’incertitude</h1><p>{introText}</p><div className="compass-actions"><button className="primary" onClick={onStart}>Commencer</button><button className="quiet" onClick={onBack}>Retour à la fin du conte</button></div><small>Vos réponses restent uniquement sur cet appareil.</small></section>
}
