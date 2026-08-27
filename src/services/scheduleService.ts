import type { ApiEnvelope } from '../types/api'
import { unwrapData, unwrapList } from '../types/api'
import type { Schedule, ScheduleDraft } from '../types/workspace'
import { deleteJson, getJson, patchJson, postJson } from './http'

type ScheduleResponse = Schedule | ApiEnvelope<Schedule>
type ScheduleListResponse = Schedule[] | ApiEnvelope<Schedule[]>

export async function getSchedules(tripId: string, date?: string): Promise<Schedule[]> {
  const response = await getJson<ScheduleListResponse>(`/api/v1/trips/${tripId}/schedules/`, {
    params: date ? { date } : undefined,
  })
  return unwrapList(response)
}

export async function createSchedule(tripId: string, schedule: ScheduleDraft): Promise<Schedule> {
  return unwrapData(await postJson<ScheduleResponse, ScheduleDraft>(`/api/v1/trips/${tripId}/schedules/`, schedule))
}

export async function patchSchedule(scheduleId: string, patch: Partial<ScheduleDraft>): Promise<Schedule> {
  return unwrapData(await patchJson<ScheduleResponse, Partial<ScheduleDraft>>(`/api/v1/schedules/${scheduleId}/`, patch))
}

export async function deleteSchedule(scheduleId: string) {
  await deleteJson(`/api/v1/schedules/${scheduleId}/`)
}
