import type { ApiEnvelope } from './api'

export type BudgetBand = 'LOW' | 'MID' | 'HIGH'
export type AccommodationType = 'HOTEL' | 'PENSION' | 'GUESTHOUSE' | 'ETC'

export type PreferencePayload = {
  accommodationType: AccommodationType
  additionalNotes?: string
  budgetBand: BudgetBand
  mustHaves?: string
}

export type Preference = {
  accommodationType: AccommodationType
  additionalNotes: string | null
  budgetBand: BudgetBand
  mustHaves: string
  participantId: string
  preferenceId: string
  submittedAt: string
  updatedAt: string
  userId: string
  username: string
}

export type PreferenceListData = {
  participantCount: number
  preferences: Preference[]
  submittedCount: number
  tripId: string
}

export type PreferenceResponse = ApiEnvelope<Preference>
export type PreferenceListResponse = ApiEnvelope<PreferenceListData>
