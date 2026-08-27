import type { ApiEnvelope, PaginatedResponse } from './api'

export type BudgetBand = 'UP_TO_200000_KRW' | 'FROM_200000_TO_400000_KRW' | 'FROM_400000_TO_600000_KRW' | 'OVER_600000_KRW' | 'NO_PREFERENCE'
export type AccommodationType = 'HOTEL' | 'RESORT_OR_POOL_VILLA' | 'EMOTIONAL_STAY_OR_PENSION' | 'GUESTHOUSE' | 'NO_PREFERENCE'

export type PreferencePayload = {
  accommodationType?: AccommodationType
  additionalNotes?: string
  availableDateText?: string
  budgetBand?: BudgetBand
  displayName: string
  mustHaves?: string
}

export type Preference = PreferencePayload & { preferenceId?: string; tripId?: string }
export type PreferenceResponse = Preference | ApiEnvelope<Preference>
export type PreferenceListResponse = Preference[] | PaginatedResponse<Preference> | ApiEnvelope<Preference[]> | ApiEnvelope<PaginatedResponse<Preference>>
