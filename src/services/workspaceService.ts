import type { ApiEnvelope } from '../types/api'
import { unwrapData, unwrapList } from '../types/api'
import type { TripListResponse } from '../types/trip'
import type { Member, Schedule, ScheduleDraft, TeamSpace, TeamSpaceDetail } from '../types/workspace'
import { getCurrentUser } from './authService'
import { getJson, hasApiServer } from './http'
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

const demoSpaces: TeamSpace[] = [
  { id: 'gangneung-2026', title: '강릉시 여행', destination: '강릉시', dateLabel: '2026-09-12 - 2026-09-14', memberCount: 4, role: 'MANAGER', status: 'COLLECTING_RESPONSES' },
]
const demoSchedules: Schedule[] = [
  { scheduleId: 's1', tripId: 'gangneung-2026', createdBy: 'demo-user', date: '2026-09-12', startTime: '10:30', endTime: null, title: '강릉역 도착', place: '강릉역', description: '렌터카 픽업 후 출발', orderIndex: 0, sourceType: 'MANUAL', isFixed: false },
  { scheduleId: 's2', tripId: 'gangneung-2026', createdBy: 'demo-user', date: '2026-09-12', startTime: '12:00', endTime: null, title: '첫 식사', place: '중앙시장', description: '현지 메뉴 고르기', orderIndex: 1, sourceType: 'MANUAL', isFixed: false },
]

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
  if (!hasApiServer()) return demoSpaces
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
  if (!hasApiServer()) {
    return {
      ...demoSpaces[0],
      description: '함께 만드는 우리만의 여행 루트',
      members: [
        { id: 'm1', name: '하늘', role: 'MANAGER' },
        { id: 'm2', name: '지민', role: 'MEMBER' },
      ],
      schedules: demoSchedules,
    }
  }

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
  if (!hasApiServer()) {
    return {
      ...schedule,
      scheduleId: crypto.randomUUID(),
      tripId,
      createdBy: 'demo-user',
      description: schedule.description ?? null,
      endTime: schedule.endTime ?? null,
      place: schedule.place ?? null,
      startTime: schedule.startTime ?? null,
      orderIndex: schedule.orderIndex ?? 0,
      sourceType: 'MANUAL',
      isFixed: schedule.isFixed ?? false,
    }
  }
  return createSchedule(tripId, schedule)
}

export async function updateSchedule(scheduleId: string, patch: Partial<ScheduleDraft>): Promise<Schedule> {
  if (!hasApiServer()) {
    return {
      scheduleId,
      tripId: 'demo-trip',
      createdBy: 'demo-user',
      date: patch.date ?? '',
      description: patch.description ?? null,
      endTime: patch.endTime ?? null,
      isFixed: patch.isFixed ?? false,
      orderIndex: patch.orderIndex ?? 0,
      place: patch.place ?? null,
      sourceType: 'MANUAL',
      startTime: patch.startTime ?? null,
      title: patch.title ?? '',
    }
  }
  return patchSchedule(scheduleId, patch)
}

export async function removeSchedule(scheduleId: string) {
  if (!hasApiServer()) return
  await deleteSchedule(scheduleId)
}
