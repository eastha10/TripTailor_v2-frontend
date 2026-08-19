import { useMemo } from 'react'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { SurveyPage } from './pages/SurveyPage'
import { MyPage } from './pages/MyPage'
import { WorkspacePage } from './pages/WorkspacePage'
import { isAuthenticated } from './services/authService'
import './styles/shared.css'
import './styles/home.css'
import './styles/planner.css'
import './styles/auth.css'
import './styles/survey.css'
import './styles/share.css'
import './styles/workspace.css'

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const authMode = params.get('auth')
  if (authMode === 'login' || authMode === 'signup') return <AuthPage initialMode={authMode} next={params.get('next') ?? '/'} />
  const protectedTarget = params.get('invite') || params.get('page') === 'my' || params.get('trip')
  if (protectedTarget && !isAuthenticated()) {
    const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`)
    window.location.replace(`/?auth=login&next=${next}`)
    return null
  }
  if (params.get('invite')) return <SurveyPage people={Number(params.get('people')) || 2} />
  if (params.get('trip')) return <WorkspacePage tripId={params.get('trip')!} />
  if (params.get('page') === 'my') return <MyPage />
  return <HomePage />
}

export default App
