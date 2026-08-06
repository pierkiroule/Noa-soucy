import { AppErrorBoundary } from './components/AppErrorBoundary'
import { StoryPlayer } from './story/StoryPlayer'

export default function App() {
  return <AppErrorBoundary><StoryPlayer /></AppErrorBoundary>
}
