const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '')

export function hasApiServer() { return Boolean(apiBase) }

async function requestJson<TResponse>(path: string, init: RequestInit = {}): Promise<TResponse> {
  if (!apiBase) throw new Error('API 서버 주소가 설정되지 않았습니다.')
  const token = sessionStorage.getItem('triptailor_access_token')
  const response = await fetch(`${apiBase}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers }, credentials: 'include' })
  const data = await response.json().catch(() => ({})) as TResponse & { message?: string }
  if (!response.ok) throw new Error(data.message ?? '요청을 처리하지 못했습니다.')
  return data
}

export function getJson<TResponse>(path: string) { return requestJson<TResponse>(path) }
export function postJson<TResponse, TBody>(path: string, body: TBody) { return requestJson<TResponse>(path, { method: 'POST', body: JSON.stringify(body) }) }
export function patchJson<TResponse, TBody>(path: string, body: TBody) { return requestJson<TResponse>(path, { method: 'PATCH', body: JSON.stringify(body) }) }
export function deleteJson<TResponse>(path: string) { return requestJson<TResponse>(path, { method: 'DELETE' }) }
