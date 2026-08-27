import type { ApiEnvelope } from './api'
import type { TravelPeriod } from './trip'

export type Invitation = {
  participantLimit: number
  regionName: string
  travelPeriod: TravelPeriod
  tripId: string
}

export type InviteLink = {
  inviteActive: boolean
  inviteCode: string
  inviteUrl: string
}

export type AcceptedInvitation = {
  joinedAt: string
  participantId: string
  tripId: string
}

export type InvitationResponse = Invitation | ApiEnvelope<Invitation>
export type InviteLinkResponse = InviteLink | ApiEnvelope<InviteLink>
export type AcceptedInvitationResponse = AcceptedInvitation | ApiEnvelope<AcceptedInvitation>
