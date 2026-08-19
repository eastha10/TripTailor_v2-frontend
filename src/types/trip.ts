export type TripDraft = { people: number; region: string; startDate: string; endDate: string }
export type TripResponse = { tripId?: string | number; inviteCode?: string; inviteLink?: string; data?: { tripId?: string | number; inviteCode?: string; inviteLink?: string } }
