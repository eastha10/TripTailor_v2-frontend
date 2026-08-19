const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '')

export function hasApiServer() { return Boolean(apiBase) }

export async function postJson<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  if (!apiBase) throw new Error('API 서버 주소가 설정되지 않았습니다.')
  const response = await fetch(`${apiBase}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
  const data = await response.json().catch(() => ({})) as TResponse & { message?: string }
  if (!response.ok) throw new Error(data.message ?? '요청을 처리하지 못했습니다.')
  return data
}
