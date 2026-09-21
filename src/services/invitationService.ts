import { unwrapData } from '../types/api'
import type { AcceptedInvitation, AcceptedInvitationResponse, Invitation, InvitationResponse, InviteLink, InviteLinkResponse } from '../types/invitation'
import { deleteJson, getJson, postJson } from './http'

export async function getInvitation(inviteCode: string): Promise<Invitation> {
  return unwrapData(await getJson<InvitationResponse>(`/api/v1/invitations/${inviteCode}/`))
}

export async function acceptInvitation(inviteCode: string): Promise<AcceptedInvitation> {
  return unwrapData(await postJson<AcceptedInvitationResponse, undefined>(`/api/v1/invitations/${inviteCode}/accept/`))
}

export async function regenerateInviteLink(tripId: string): Promise<InviteLink> {
  return unwrapData(await postJson<InviteLinkResponse, undefined>(`/api/v1/trips/${tripId}/invite-link/regenerate/`))
}

export async function revokeInviteLink(tripId: string) {
  await deleteJson(`/api/v1/trips/${tripId}/invite-link/`)
}
