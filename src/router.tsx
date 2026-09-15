import { createBrowserRouter } from 'react-router'
import { AuthRoute, HomeRoute, InvitationRoute, LegacyInvitationRoute, NotFoundPage, ProtectedRoute, ShareRoute, WorkspaceRoute } from './routes/RouteElements'

export const router = createBrowserRouter([
  { path: '/', element: <HomeRoute /> },
  { path: '/login', element: <AuthRoute mode="login" /> },
  { path: '/signup', element: <AuthRoute mode="signup" /> },
  { path: '/share', element: <ShareRoute /> },
  { path: '/trip/:inviteCode', element: <InvitationRoute /> },
  { path: '/invitations/:inviteCode', element: <LegacyInvitationRoute /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/mypage',
        hydrateFallbackElement: <div className="workspace-state">여행을 불러오는 중…</div>,
        lazy: async () => ({ Component: (await import('./pages/MyPage')).MyPage }),
      },
      { path: '/trips/:tripId', element: <WorkspaceRoute /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
