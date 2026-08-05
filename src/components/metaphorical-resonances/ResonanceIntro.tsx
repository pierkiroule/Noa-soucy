export function ResonanceIntro({ onOpen, onFinish }: { onOpen:()=>void; onFinish:()=>void }) {
  return <main className="story flower-flow flower-intro-screen">
    <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    <section className="flower-intro" aria-labelledby="flower-intro-title">
      <span className="eyebrow">Prolonger la traversée</span>
      <h1 id="flower-intro-title">Résonances métaphoriques</h1>
      <p>Certaines images continuent de résonner après la fin d’un conte.</p>
      <p>Cette fleur vous propose huit chemins pour prolonger la traversée.</p>
      <p>Touchez simplement le pétale qui vous appelle aujourd’hui.</p>
      <p>Il n’y a rien à réussir.</p>
      <p>Vous pouvez explorer un seul pétale, plusieurs, ou revenir plus tard.</p>
      <small>Vos mots restent uniquement sur cet appareil. Rien n’est envoyé à un serveur.</small>
      <div className="flower-actions"><button className="primary" onClick={onOpen}>Ouvrir la fleur</button><button className="quiet" onClick={onFinish}>Terminer ici</button></div>
    </section>
  </main>
}
