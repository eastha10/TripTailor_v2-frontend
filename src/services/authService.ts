import type { AuthPayload, AuthResponse, LoginRequest, SignupRequest, UpdateProfileRequest, User, UserResponse } from '../types/auth'
import { unwrapData } from '../types/api'
import { clearAuthSession, deleteJson, getAccessToken, getJson, getRefreshToken, patchJson, postJson, setAuthTokens } from './http'

function getAuthPayload(response: AuthResponse): AuthPayload {
  return unwrapData(response)
}

function saveAuth(payload: AuthPayload, fallbackName: string) {
  const accessToken = payload.accessToken ?? payload.access_token ?? payload.access ?? payload.token
  const refreshToken = payload.refreshToken ?? payload.refresh_token
  if (!accessToken || !refreshToken) throw new Error('로그인 응답에 인증 토큰이 없습니다.')
  setAuthTokens(accessToken, refreshToken)
  sessionStorage.setItem('triptailor_user_name', payload.user?.username ?? fallbackName)
}

export async function login(request: LoginRequest) {
  const response = await postJson<AuthResponse, LoginRequest>('/api/v1/auth/sessions/', request)
  saveAuth(getAuthPayload(response), request.email.split('@')[0] || '여행자')
}

export function isAuthenticated() {
  return Boolean(getAccessToken())
}

export async function logout() {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) {
      await deleteJson('/api/v1/auth/sessions/current/', { data: { refreshToken } })
    }
  } catch {
    // 서버 폐기에 실패해도 이 탭의 토큰은 반드시 제거한다.
  } finally {
    clearAuthSession()
  }
}

export async function signup(request: SignupRequest) {
  await postJson<AuthResponse, SignupRequest>('/api/v1/auth/signup/', request)
}

export async function getCurrentUser(): Promise<User> {
  const response = await getJson<UserResponse>('/api/v1/users/me/')
  return unwrapData(response)
}

export async function updateProfile(request: UpdateProfileRequest): Promise<User> {
  const response = await patchJson<UserResponse, UpdateProfileRequest>('/api/v1/users/me/', request)
  const user = unwrapData(response)
  sessionStorage.setItem('triptailor_user_name', user.username)
  return user
}
