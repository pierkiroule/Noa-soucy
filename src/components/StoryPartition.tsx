import type { StoryDefinition } from '../types/story'

export function StoryPartition({ story, onClose }: { story: StoryDefinition; onClose: () => void }) {
  let actNumber = 0, questionNumber = 0
  return <main className="partition"><header><p className="eyebrow">Partition complète</p><h1>{story.metadata.title}</h1><p className="subtitle">{story.metadata.subtitle}</p><button className="button secondary" onClick={onClose}>Revenir à l’accueil</button></header>{story.storyboard.map((block, index) => {
    if (block.type === 'resonance') return null
    if (block.type === 'act') { const act = story.acts[block.module]; actNumber++; return <article key={index}><p className="eyebrow">Acte {actNumber}</p><h2>{act.title}</h2><div className="story-text">{act.text}</div></article> }
    if (block.type === 'choice') { const choice = story.choices[block.module]; questionNumber++; return <section key={index}><p className="eyebrow">Question {questionNumber}</p><h2>{choice.question}</h2>{choice.options.map((option) => { const resonance = story.resonances[option.resonanceId]; return <article className="partition-resonance" key={option.id}><h3>Résonance — {option.label}</h3><div className="story-text">{resonance.text}</div></article> })}</section> }
    const ending = story.endings[block.module]; return <article key={index}><p className="eyebrow">Épilogue</p><h2>{ending.title}</h2><div className="story-text">{ending.text}</div></article>
  })}</main>
}
