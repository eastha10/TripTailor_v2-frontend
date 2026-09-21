import type { Preference, PreferenceListResponse, PreferencePayload, PreferenceResponse } from '../types/preference'
import { unwrapData, unwrapList } from '../types/api'
import { getJson, patchJson, postJson } from './http'

export async function getPreferences(tripId: string): Promise<Preference[]> {
  const response = await getJson<PreferenceListResponse>(`/api/v1/trips/${tripId}/preferences/`)
  return unwrapList(response)
}

export async function createPreference(tripId: string, payload: PreferencePayload): Promise<Preference> {
  // v2의 선호도 상세 페이지는 비어 있어, 이 요청 형식은 이전 명세와의 임시 호환 계층이다.
  const response = await postJson<PreferenceResponse, PreferencePayload>(`/api/v1/trips/${tripId}/preferences/`, payload)
  return unwrapData(response)
}

export async function getMyPreference(tripId: string): Promise<Preference> {
  const response = await getJson<PreferenceResponse>(`/api/v1/trips/${tripId}/preferences/me/`)
  return unwrapData(response)
}

export async function updateMyPreference(tripId: string, payload: Partial<PreferencePayload>): Promise<Preference> {
  const response = await patchJson<PreferenceResponse, Partial<PreferencePayload>>(`/api/v1/trips/${tripId}/preferences/me/`, payload)
  return unwrapData(response)
}
