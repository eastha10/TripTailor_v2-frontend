import type { TripDraft, TripResponse } from '../types/trip'
import { hasApiServer, postJson } from './http'

export async function createTrip(draft: TripDraft) {
  if (!hasApiServer()) return `${window.location.origin}/?invite=${Math.random().toString(36).slice(2, 9)}&people=${draft.people}`
  const response = await postJson<TripResponse, object>('/api/v1/trips/', { participantCount: draft.people, destination: draft.region, startDate: draft.startDate, endDate: draft.endDate })
  const code = response.inviteCode ?? response.data?.inviteCode ?? response.tripId ?? response.data?.tripId
  return response.inviteLink ?? response.data?.inviteLink ?? `${window.location.origin}/?invite=${code}`
}
