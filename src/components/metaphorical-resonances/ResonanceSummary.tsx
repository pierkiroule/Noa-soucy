import { metaphoricalResonances } from '../../data/metaphoricalResonances'
import type { ResonanceAnswer } from '../../types/metaphoricalResonances'

export function ResonanceSummary({ visitedAnswers, onBackToCompass, onFinish, onRestartStory }: { visitedAnswers:ResonanceAnswer[]; onBackToCompass:()=>void; onFinish:()=>void; onRestartStory:()=>void }) {
  const byId = new Map(visitedAnswers.map(answer => [answer.petalId, answer]))
  const visitedDirections = metaphoricalResonances.filter(petal => byId.has(petal.id))
  return <section className="compass-summary compass-petal-fx" aria-labelledby="compass-summary-title">
    <span className="eyebrow">Fin libre</span>
    <h1 id="compass-summary-title">Les résonances que vous gardez aujourd’hui</h1>
    {visitedDirections.length === 0 ? <p>Aucune direction n’a été explorée aujourd’hui. Vous pouvez simplement laisser la traversée se déposer.</p> : <ol>{visitedDirections.map(petal => {
      return <li key={petal.id}><h2>{petal.glyph} {petal.actionLabel}</h2><p>{petal.question}</p><blockquote>Cette direction a simplement été explorée.</blockquote></li>
    })}</ol>}
    <p>Ces résonances ne vous définissent pas.</p>
    <p>Elles montrent simplement les images et les questions qui ont trouvé une place dans votre traversée aujourd’hui.</p>
    <p>Vous pourrez revenir ouvrir une autre direction lorsque le vent aura changé.</p>
    <div className="compass-actions"><button className="quiet" onClick={onBackToCompass}>Revenir à la boussole</button><button className="primary" onClick={onFinish}>Terminer la traversée</button><button className="quiet" onClick={onRestartStory}>Recommencer le conte</button></div>
  </section>
}
