import type { ApiEnvelope } from '../types/api'
import { unwrapData, unwrapList } from '../types/api'
import type { TripListResponse } from '../types/trip'
import type { Member, Schedule, ScheduleDraft, TeamSpace, TeamSpaceDetail } from '../types/workspace'
import { getCurrentUser } from './authService'
import { getJson } from './http'
import { createSchedule, deleteSchedule, getSchedules, patchSchedule } from './scheduleService'
import { getTrip } from './tripService'

type ParticipantApi = {
  isOwner?: boolean
  joinedAt: string
  participantId: string
  profileImageUrl?: string | null
  role?: string
  userId: string
  username: string
}
type ParticipantsData = { participantCount: number; participantLimit: number; participants: ParticipantApi[]; tripId: string }
type ParticipantsResponse = ParticipantsData | ApiEnvelope<ParticipantsData>

function formatDateRange(startDate: string, endDate: string) {
  return `${startDate} - ${endDate}`
}

function mapMember(participant: ParticipantApi): Member {
  const isOwner = participant.isOwner || participant.role === 'LEADER' || participant.role === 'OWNER'
  return {
    id: participant.participantId,
    name: participant.username,
    profileImageUrl: participant.profileImageUrl,
    role: isOwner ? 'MANAGER' : 'MEMBER',
  }
}

export async function getTeamSpaces(): Promise<TeamSpace[]> {
  const response = await getJson<TripListResponse>('/api/v1/users/me/trips/', { params: { page: 0, size: 20 } })
  return unwrapList(response).map(trip => ({
    id: trip.tripId,
    title: `${trip.regionName} 여행`,
    destination: trip.regionName,
    dateLabel: formatDateRange(trip.startDate, trip.endDate),
    memberCount: trip.participantLimit,
    role: trip.isOwner ? 'MANAGER' : 'MEMBER',
    status: trip.status,
  }))
}

export async function getTeamSpace(id: string): Promise<TeamSpaceDetail> {
  const [trip, participantsResponse, schedules, currentUser] = await Promise.all([
    getTrip(id),
    getJson<ParticipantsResponse>(`/api/v1/trips/${id}/participants/`),
    getSchedules(id),
    getCurrentUser(),
  ])
  const participantData = unwrapData(participantsResponse)
  const members = participantData.participants.map(mapMember)

  return {
    id: trip.tripId,
    title: `${trip.region.name} 여행`,
    destination: trip.region.name,
    dateLabel: formatDateRange(trip.travelPeriod.startDate, trip.travelPeriod.endDate),
    memberCount: participantData.participantCount,
    role: trip.ownerId === currentUser.userId ? 'MANAGER' : 'MEMBER',
    status: trip.status,
    description: '함께 만드는 우리만의 여행 루트',
    members,
    schedules,
  }
}

export async function addSchedule(tripId: string, schedule: ScheduleDraft): Promise<Schedule> {
  return createSchedule(tripId, schedule)
}

export async function updateSchedule(scheduleId: string, patch: Partial<ScheduleDraft>): Promise<Schedule> {
  return patchSchedule(scheduleId, patch)
}

export async function removeSchedule(scheduleId: string) {
  await deleteSchedule(scheduleId)
}
