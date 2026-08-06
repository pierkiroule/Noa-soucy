export function ResonanceIntro({ onOpen, onFinish }: { onOpen:()=>void; onFinish:()=>void }) {
  return <main className="story compass-flow compass-intro-screen">
    <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    <section className="compass-intro compass-petal-fx" aria-labelledby="compass-intro-title">
      <span className="eyebrow">Prolonger la traversée</span>
      <h1 id="compass-intro-title">Résonances métaphoriques</h1>
      <p>Certaines images continuent de résonner après la fin d’un conte.</p>
      <p>Cette boussole vous propose huit directions pour prolonger la traversée.</p>
      <p>Touchez simplement la direction qui vous appelle aujourd’hui.</p>
      <p>Il n’y a rien à réussir.</p>
      <p>Vous pouvez explorer une seule direction, plusieurs, ou revenir plus tard.</p>
      <small>Vos mots restent uniquement sur cet appareil. Rien n’est envoyé à un serveur.</small>
      <div className="compass-actions"><button className="primary" onClick={onOpen}>Ouvrir la boussole</button><button className="quiet" onClick={onFinish}>Terminer ici</button></div>
    </section>
  </main>
}
