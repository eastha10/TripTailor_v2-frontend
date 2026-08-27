import { unwrapData } from '../types/api'
import type { AcceptedInvitation, AcceptedInvitationResponse, Invitation, InvitationResponse, InviteLink, InviteLinkResponse } from '../types/invitation'
import { deleteJson, getJson, hasApiServer, postJson } from './http'

export async function getInvitation(inviteCode: string): Promise<Invitation> {
  if (!hasApiServer()) {
    return {
      participantLimit: 4,
      regionName: '강릉시',
      travelPeriod: { startDate: '2026-09-12', endDate: '2026-09-14' },
      tripId: 'demo-trip',
    }
  }
  return unwrapData(await getJson<InvitationResponse>(`/api/v1/invitations/${inviteCode}/`))
}

export async function acceptInvitation(inviteCode: string): Promise<AcceptedInvitation> {
  if (!hasApiServer()) {
    return { participantId: 'demo-participant', tripId: 'demo-trip', joinedAt: new Date().toISOString() }
  }
  return unwrapData(await postJson<AcceptedInvitationResponse, undefined>(`/api/v1/invitations/${inviteCode}/accept/`))
}

export async function regenerateInviteLink(tripId: string): Promise<InviteLink> {
  return unwrapData(await postJson<InviteLinkResponse, undefined>(`/api/v1/trips/${tripId}/invite-link/regenerate/`))
}

export async function revokeInviteLink(tripId: string) {
  await deleteJson(`/api/v1/trips/${tripId}/invite-link/`)
}
