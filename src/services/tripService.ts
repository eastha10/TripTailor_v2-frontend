import { unwrapData, unwrapList } from '../types/api'
import type { RegionListItem, RegionListResponse, Trip, TripCreatePayload, TripDraft, TripResponse } from '../types/trip'
import { deleteJson, getJson, postJson } from './http'

export type AiItineraryGeneration = {
  error?: string | null
  generationId: string
  status: 'PENDING' | 'NORMALIZING' | 'ANALYZING' | 'RETRIEVING' | 'PLANNING' | 'VALIDATING' | 'REPAIRING' | 'NEEDS_INPUT' | 'NEEDS_REVIEW' | 'APPROVED' | 'FAILED'
  unresolvedIssues?: string[]
}

export async function getRegions(): Promise<RegionListItem[]> {
  return unwrapList(await getJson<RegionListResponse>('/api/v1/regions/'))
}

export async function createTrip(draft: TripDraft) {
  const payload: TripCreatePayload = {
    participantLimit: draft.people,
    regionId: draft.regionId,
    travelPeriod: { startDate: draft.startDate, endDate: draft.endDate },
  }
  const trip = unwrapData(await postJson<TripResponse, TripCreatePayload>('/api/v1/trips/', payload))
  if (!trip.inviteUrl) throw new Error('여행 생성 응답에 초대 링크 정보가 없습니다.')
  return trip.inviteUrl
}

export async function getTrip(tripId: string): Promise<Trip> {
  return unwrapData(await getJson<TripResponse>(`/api/v1/trips/${tripId}/`))
}

export async function generateTripItinerary(tripId: string): Promise<AiItineraryGeneration> {
  return unwrapData(await postJson<AiItineraryGeneration | { data: AiItineraryGeneration }, Record<string, never>>(
    `/api/v1/trips/${tripId}/itinerary/generations/`,
    {},
  ))
}

export async function deleteTrip(tripId: string) {
  await deleteJson(`/api/v1/trips/${tripId}/`)
}
