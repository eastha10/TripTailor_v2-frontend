import type { AuthResponse, LoginRequest, SignupRequest } from '../types/auth'
import { hasApiServer, postJson } from './http'

const ACCESS_TOKEN_KEY = 'triptailor_access_token'

export async function login(request: LoginRequest) {
  if (!hasApiServer()) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, 'demo-access-token')
    sessionStorage.setItem('triptailor_user_name', request.email.split('@')[0] || '여행자')
    return
  }
  const response = await postJson<AuthResponse, LoginRequest>('/api/v1/auth/sessions/', request)
  const accessToken = response.accessToken ?? response.data?.accessToken
  if (accessToken) sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function isAuthenticated() { return Boolean(sessionStorage.getItem(ACCESS_TOKEN_KEY)) }
export function logout() { sessionStorage.removeItem(ACCESS_TOKEN_KEY); sessionStorage.removeItem('triptailor_user_name') }

export async function signup(request: SignupRequest) {
  if (!hasApiServer()) return
  await postJson<AuthResponse, SignupRequest>('/api/v1/auth/signup/', request)
}
