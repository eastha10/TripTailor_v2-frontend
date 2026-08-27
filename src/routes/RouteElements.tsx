import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useParams, useSearchParams } from 'react-router'
import { isAuthenticated } from '../services/authService'
import { AuthPage } from '../pages/AuthPage'
import { HomePage } from '../pages/HomePage'
import { SharePage } from '../pages/SharePage'
import { SurveyPage } from '../pages/SurveyPage'
import { WorkspacePage } from '../pages/WorkspacePage'
import type { AuthMode } from '../types/auth'

export function HomeRoute() {
  const [params] = useSearchParams()
  const authMode = params.get('auth')
  const inviteCode = params.get('invite')
  const tripId = params.get('trip')

  if (authMode === 'login' || authMode === 'signup') {
    const next = params.get('next')
    return <Navigate replace to={`/${authMode}${next ? `?next=${encodeURIComponent(next)}` : ''}`} />
  }
  if (params.get('page') === 'my') return <Navigate replace to="/mypage" />
  if (tripId) return <Navigate replace to={`/trips/${encodeURIComponent(tripId)}`} />
  if (inviteCode) return <Navigate replace to={`/trip/${encodeURIComponent(inviteCode)}`} />
  return <HomePage />
}

export function AuthRoute({ mode }: { mode: AuthMode }) {
  const [params] = useSearchParams()
  const requestedNext = params.get('next')
  const next = requestedNext?.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/'
  return <AuthPage key={mode} initialMode={mode} next={next} />
}

export function ProtectedRoute() {
  const location = useLocation()
  const [, setAuthRevision] = useState(0)

  useEffect(() => {
    const onExpired = () => setAuthRevision(revision => revision + 1)
    window.addEventListener('triptailor:auth-expired', onExpired)
    return () => window.removeEventListener('triptailor:auth-expired', onExpired)
  }, [])

  if (!isAuthenticated()) {
    const next = `${location.pathname}${location.search}`
    return <Navigate replace to={`/login?next=${encodeURIComponent(next)}`} />
  }
  return <Outlet />
}

export function WorkspaceRoute() {
  const { tripId } = useParams()
  return tripId ? <WorkspacePage tripId={tripId} /> : <Navigate replace to="/mypage" />
}

export function InvitationRoute() {
  const { inviteCode } = useParams()
  return inviteCode ? <SurveyPage inviteCode={inviteCode} /> : <Navigate replace to="/" />
}

export function LegacyInvitationRoute() {
  const { inviteCode } = useParams()
  return <Navigate replace to={inviteCode ? `/trip/${encodeURIComponent(inviteCode)}` : '/'} />
}

export function ShareRoute() {
  const location = useLocation()
  const url = (location.state as { url?: string } | null)?.url
  return url ? <SharePage url={url} /> : <Navigate replace to="/" />
}

export function NotFoundPage() {
  return <main className="simple-page"><section className="center-card"><p className="eyebrow">PAGE NOT FOUND</p><h1>페이지를 찾을 수 없어요.</h1><Link className="primary-button link-button" to="/">홈으로</Link></section></main>
}
