import type { Preference, PreferenceListResponse, PreferencePayload, PreferenceResponse } from '../types/preference'
import { unwrapData } from '../types/api'
import { getJson, patchJson, postJson } from './http'

export async function getPreferences(tripId: string): Promise<Preference[]> {
  const response = await getJson<PreferenceListResponse>(`/api/v1/trips/${tripId}/preferences/`)
  return unwrapData(response).preferences
}

export async function createPreference(tripId: string, payload: PreferencePayload): Promise<Preference> {
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
