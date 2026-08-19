import { useMemo } from 'react'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { SurveyPage } from './pages/SurveyPage'
import './styles/shared.css'
import './styles/home.css'
import './styles/planner.css'
import './styles/auth.css'
import './styles/survey.css'
import './styles/share.css'

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const authMode = params.get('auth')
  if (authMode === 'login' || authMode === 'signup') return <AuthPage initialMode={authMode} />
  if (params.get('invite')) return <SurveyPage people={Number(params.get('people')) || 2} />
  return <HomePage />
}

export default App
