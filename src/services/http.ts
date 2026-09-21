import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

const productionApiBaseUrl = 'https://triptailor-backend-206035909634.asia-northeast3.run.app'
const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
const resolvedApiBaseUrl = configuredApiBaseUrl || (import.meta.env.PROD ? productionApiBaseUrl : undefined)
const apiBaseUrl = resolvedApiBaseUrl === '/' ? '/' : resolvedApiBaseUrl?.replace(/\/+$/, '')
const requestLanguage = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en') ? 'en-US' : 'ko-KR'

export const ACCESS_TOKEN_KEY = 'triptailor_access_token'
export const REFRESH_TOKEN_KEY = 'triptailor_refresh_token'

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }
type ApiErrorDetail = {
  code?: string
  field?: string | Record<string, string[]> | null
  message?: string
  requestId?: string
}
type ApiErrorBody = { detail?: string; error?: ApiErrorDetail | string; message?: string }

export class ApiError extends Error {
  code?: string
  field?: ApiErrorDetail['field']
  requestId?: string
  status?: number

  constructor(message: string, options: { code?: string; field?: ApiErrorDetail['field']; requestId?: string; status?: number } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.field = options.field
    this.requestId = options.requestId
    this.status = options.status
  }
}

export function hasApiServer() {
  return Boolean(apiBaseUrl)
}

export function requireApiServer() {
  if (!apiBaseUrl) throw new ApiError('API 서버 주소가 설정되지 않았습니다.')
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearAuthSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem('triptailor_user_name')
}

function getErrorDetail(error: AxiosError<ApiErrorBody>): ApiErrorDetail {
  const body = error.response?.data
  if (body?.error && typeof body.error === 'object') return body.error
  return { message: typeof body?.error === 'string' ? body.error : body?.message ?? body?.detail }
}

export function toApiError(error: unknown) {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const detail = getErrorDetail(error)
    return new ApiError(detail.message ?? '요청을 처리하지 못했습니다.', {
      code: detail.code,
      field: detail.field,
      requestId: detail.requestId,
      status: error.response?.status,
    })
  }
  return error instanceof Error ? error : new ApiError('요청을 처리하지 못했습니다.')
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Accept-Language': requestLanguage,
  },
})

const refreshClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Accept-Language': requestLanguage,
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

function findToken(payload: unknown, keys: string[]): string | null {
  if (!payload || typeof payload !== 'object') return null
  const record = payload as Record<string, unknown>
  for (const key of keys) {
    if (typeof record[key] === 'string') return record[key]
  }
  return findToken(record.data, keys)
}

let refreshPromise: Promise<string> | null = null

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const request = error.config as RetriableRequestConfig | undefined
    const refreshToken = getRefreshToken()
    const canRefresh = error.response?.status === 401
      && request
      && !request._retry
      && !request.url?.includes('/auth/sessions/refresh/')
      && Boolean(getAccessToken())
      && Boolean(refreshToken)

    if (!canRefresh || !request || !refreshToken) return Promise.reject(toApiError(error))

    request._retry = true
    try {
      refreshPromise ??= refreshClient
        .post('/api/v1/auth/sessions/refresh/', { refreshToken })
        .then((response) => {
          const token = findToken(response.data, ['accessToken', 'access_token', 'access', 'token'])
          if (!token) throw new ApiError('로그인 정보를 갱신하지 못했습니다.', { status: 401 })
          setAccessToken(token)
          return token
        })
        .finally(() => { refreshPromise = null })

      const token = await refreshPromise
      request.headers.set('Authorization', `Bearer ${token}`)
      return apiClient(request)
    } catch (refreshError) {
      clearAuthSession()
      window.dispatchEvent(new Event('triptailor:auth-expired'))
      return Promise.reject(toApiError(refreshError))
    }
  },
)

export async function getJson<TResponse>(path: string, config?: AxiosRequestConfig) {
  requireApiServer()
  const response = await apiClient.get<TResponse>(path, config)
  return response.data
}

export async function postJson<TResponse, TBody>(path: string, body?: TBody, config?: AxiosRequestConfig) {
  requireApiServer()
  const response = await apiClient.post<TResponse>(path, body, config)
  return response.data
}

export async function patchJson<TResponse, TBody>(path: string, body: TBody, config?: AxiosRequestConfig) {
  requireApiServer()
  const response = await apiClient.patch<TResponse>(path, body, config)
  return response.data
}

export async function deleteJson<TResponse = void>(path: string, config?: AxiosRequestConfig) {
  requireApiServer()
  const response = await apiClient.delete<TResponse>(path, config)
  return response.data
}
