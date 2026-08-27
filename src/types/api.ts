export type ApiEnvelope<T> = { data: T; message?: string }

export type PaginatedResponse<T> = {
  count?: number
  next?: string | null
  previous?: string | null
  results: T[]
}

export function unwrapData<T>(response: T | ApiEnvelope<T>): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiEnvelope<T>).data
  }
  return response as T
}

export function unwrapList<T>(response: T[] | ApiEnvelope<T[]> | PaginatedResponse<T> | ApiEnvelope<PaginatedResponse<T>>): T[] {
  const data = unwrapData(response)
  return Array.isArray(data) ? data : data.results
}
