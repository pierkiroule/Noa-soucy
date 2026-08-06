import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur inattendue dans NAO SOUCI', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return <main className="loading error-state" role="alert">
      <span className="error-state__mark" aria-hidden="true">◌</span>
      <p className="eyebrow">La traversée s’est interrompue</p>
      <h1>Retrouvons le fil du conte.</h1>
      <p>Votre progression est conservée sur cet appareil.</p>
      <button className="primary" onClick={() => window.location.reload()}>Recharger l’expérience</button>
    </main>
  }
}
