import { useState, type ReactNode } from 'react'
import { setMockNutState, resetMockNuts } from '../../services/mockNutAccessService'
import { useNutAccess } from '../../hooks/useNutAccess'
import { NutOfferContext } from './nutOfferContext'

export function NutAccessGuard({ nutToken, children }: { nutToken: string; children: ReactNode }) {
  const { state, associateNao, offerNao, refresh } = useNutAccess(nutToken)
  const [recognized, setRecognized] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [offered, setOffered] = useState(false)
  const doAssociate = async () => { await associateNao(); setRecognized(true) }
  const doOffer = async () => { await offerNao(); setConfirming(false); setOffered(true) }
  const simulate = async (next: 'free' | 'mine' | 'locked') => { setMockNutState(nutToken, next); setRecognized(false); setOffered(false); await refresh() }
  return <>
    {state.status === 'loading' && <AccessScreen title="Nao se rapproche…" live />}
    {state.status === 'error' && <AccessScreen title="Nao n’arrive pas à retrouver son chemin pour le moment." action={<button className="quiet" onClick={() => void refresh()}>Réessayer</button>} />}
    {state.status === 'free' && !offered && <AccessScreen eyebrow="libre" title="Cette noix est libre." text="Vous pouvez associer Nao à ce téléphone pour commencer votre traversée." action={<button className="primary" onClick={() => void doAssociate()}>Associer Nao</button>} />}
    {state.status === 'free' && offered && <AccessScreen eyebrow="transmission" title="Nao est prêt à poursuivre son voyage." text="Vous pouvez maintenant le confier à quelqu’un d’autre." action={<button className="quiet" onClick={() => setOffered(false)}>Fermer</button>} />}
    {state.status === 'locked' && <AccessScreen eyebrow="associée ailleurs" title="Nao accompagne déjà quelqu’un d’autre." text="Il devra être offert avant de pouvoir être associé à ce téléphone." action={<button className="quiet" onClick={() => history.back()}>Retour</button>} />}
    {state.status === 'mine' && recognized && <AccessScreen eyebrow="associée ici" title="Nao vous reconnaît désormais." action={<button className="primary" onClick={() => setRecognized(false)}>Commencer la traversée</button>} />}
    {state.status === 'mine' && !recognized && <NutOfferContext.Provider value={() => setConfirming(true)}><div className="nut-story"><div className="nut-recognition"><span>Nao vous reconnaît.</span><button onClick={() => document.querySelector<HTMLButtonElement>('.intro .primary')?.click()}>Poursuivre la traversée</button></div>{children}</div></NutOfferContext.Provider>}
    {confirming && <div className="nut-modal" role="dialog" aria-modal="true" aria-labelledby="offer-title"><div><h2 id="offer-title">Offrir Nao ?</h2><p>Votre téléphone ne sera plus associé à cette noix.</p><p>La personne qui recevra Nao pourra ensuite l’associer à son téléphone et commencer sa propre traversée.</p><footer><button className="quiet" onClick={() => setConfirming(false)}>Annuler</button><button className="primary" onClick={() => void doOffer()}>Offrir Nao</button></footer></div></div>}
    {import.meta.env.DEV && <aside className="nut-dev"><strong>Test accès</strong><button onClick={() => void simulate('free')}>Noix libre</button><button onClick={() => void simulate('mine')}>Associée à ce téléphone</button><button onClick={() => void simulate('locked')}>Associée à un autre téléphone</button><button onClick={() => { resetMockNuts(); void refresh() }}>Reset mock</button></aside>}
  </>
}

function AccessScreen({ eyebrow, title, text, action, live }: { eyebrow?: string; title: string; text?: string; action?: ReactNode; live?: boolean }) {
  return <main className="nut-access" aria-live={live ? 'polite' : undefined}><span className="nut-access__mark">◌</span>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{text && <p>{text}</p>}{action && <div className="nut-access__action">{action}</div>}</main>
}
