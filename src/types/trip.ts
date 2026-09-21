import type { ApiEnvelope } from './api'

export type TravelPeriod = { endDate: string; startDate: string }
export type Region = { name: string; regionId: string }
export type RegionListItem = Region & {
  nameEn: string
  lDongRegnCode: string
  lDongSignguCode: string
}
export type RegionListResponse = ApiEnvelope<RegionListItem[]>
export type TripStatus = 'COLLECTING_RESPONSES' | 'PLANNING' | 'READY'

export type TripDraft = { endDate: string; people: number; regionId: string; startDate: string }

export type Trip = {
  createdAt: string
  inviteCode: string
  inviteUrl: string
  ownerId: string
  participantLimit: number
  region: Region
  status: TripStatus
  travelPeriod: TravelPeriod
  tripId: string
}

export type TripListItem = {
  endDate: string
  isOwner: boolean
  participantLimit: number
  regionName: string
  startDate: string
  status: TripStatus
  tripId: string
}

export type TripCreatePayload = {
  participantLimit: number
  regionId: string
  travelPeriod: TravelPeriod
}

export type TripResponse = Trip | ApiEnvelope<Trip>
export type TripListResponse = TripListItem[] | ApiEnvelope<TripListItem[]>
