import type { AuthResponse, LoginRequest, SignupRequest } from '../types/auth'
import { hasApiServer, postJson } from './http'

const ACCESS_TOKEN_KEY = 'triptailor_access_token'

export async function login(request: LoginRequest) {
  if (!hasApiServer()) return
  const response = await postJson<AuthResponse, LoginRequest>('/api/v1/auth/sessions/', request)
  const accessToken = response.accessToken ?? response.data?.accessToken
  if (accessToken) sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export async function signup(request: SignupRequest) {
  if (!hasApiServer()) return
  await postJson<AuthResponse, SignupRequest>('/api/v1/auth/signup/', request)
}
