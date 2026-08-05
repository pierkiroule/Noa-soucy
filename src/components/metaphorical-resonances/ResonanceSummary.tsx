import { metaphoricalResonances } from '../../data/metaphoricalResonances'
import type { ResonanceAnswer } from '../../types/metaphoricalResonances'

export function ResonanceSummary({ visitedAnswers, onBackToFlower, onFinish, onRestartStory }: { visitedAnswers:ResonanceAnswer[]; onBackToFlower:()=>void; onFinish:()=>void; onRestartStory:()=>void }) {
  const byId = new Map(visitedAnswers.map(answer => [answer.petalId, answer]))
  const visitedPetals = metaphoricalResonances.filter(petal => byId.has(petal.id))
  return <section className="flower-summary" aria-labelledby="flower-summary-title">
    <span className="eyebrow">Fin libre</span>
    <h1 id="flower-summary-title">Les résonances que vous gardez aujourd’hui</h1>
    {visitedPetals.length === 0 ? <p>Aucun pétale n’a été exploré aujourd’hui. Vous pouvez simplement laisser la traversée se déposer.</p> : <ol>{visitedPetals.map(petal => {
      const answer = byId.get(petal.id)
      return <li key={petal.id}><h2>{petal.glyph} {petal.actionLabel}</h2><p>{petal.question}</p><blockquote>{answer?.text.trim() ? answer.text : 'Ce pétale a simplement été exploré.'}</blockquote></li>
    })}</ol>}
    <p>Ces résonances ne vous définissent pas.</p>
    <p>Elles montrent simplement les images et les questions qui ont trouvé une place dans votre traversée aujourd’hui.</p>
    <p>Vous pourrez revenir ouvrir un autre pétale lorsque le vent aura changé.</p>
    <div className="flower-actions"><button className="quiet" onClick={onBackToFlower}>Revenir à la fleur</button><button className="primary" onClick={onFinish}>Terminer la traversée</button><button className="quiet" onClick={onRestartStory}>Recommencer le conte</button></div>
  </section>
}
