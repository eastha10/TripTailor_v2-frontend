import type { Schedule, TeamSpace, TeamSpaceDetail } from '../types/workspace'
import { deleteJson, getJson, hasApiServer, patchJson, postJson } from './http'

const demoSpaces: TeamSpace[] = [
  { id:'jeju-2026', title:'우리들의 제주 여름', destination:'제주도', dateLabel:'2026. 08. 28 - 08. 31', memberCount:4, role:'MANAGER', status:'UPCOMING' },
  { id:'busan-weekend', title:'부산 주말 미식회', destination:'부산', dateLabel:'2026. 09. 12 - 09. 13', memberCount:3, role:'MEMBER', status:'PLANNING' },
  { id:'gyeongju-night', title:'경주에서 보낸 밤', destination:'경주', dateLabel:'2026. 05. 03 - 05. 05', memberCount:5, role:'MEMBER', status:'DONE' },
]
const demoSchedules: Schedule[] = [
  { id:'s1', day:1, date:'8월 28일', time:'10:30', title:'제주공항 도착', location:'제주국제공항', note:'렌터카 픽업 후 출발' },
  { id:'s2', day:1, date:'8월 28일', time:'12:00', title:'고기국수로 첫 식사', location:'자매국수', note:'대기시간 20분 예상' },
  { id:'s3', day:1, date:'8월 28일', time:'15:00', title:'함덕 해변 산책', location:'함덕해수욕장', note:'카페 델문도 들르기' },
  { id:'s4', day:2, date:'8월 29일', time:'09:00', title:'오름 트레킹', location:'아부오름', note:'편한 운동화 준비' },
]

export async function getTeamSpaces(): Promise<TeamSpace[]> {
  if (!hasApiServer()) return demoSpaces
  const response = await getJson<TeamSpace[] | { data: TeamSpace[] }>('/api/v1/users/me/trips/')
  return Array.isArray(response) ? response : response.data
}

export async function getTeamSpace(id: string): Promise<TeamSpaceDetail> {
  if (!hasApiServer()) {
    const space = demoSpaces.find(item => item.id === id) ?? demoSpaces[0]
    return { ...space, description:'함께 만드는 우리만의 여행 루트', members:[{ id:'m1', name:'하늘', role:'MANAGER' },{ id:'m2', name:'지민', role:'MEMBER' },{ id:'m3', name:'서준', role:'MEMBER' },{ id:'m4', name:'유나', role:'MEMBER' }], schedules:demoSchedules }
  }
  const [trip, members, schedules] = await Promise.all([getJson<TeamSpace>(`/api/v1/trips/${id}/`), getJson<TeamSpaceDetail['members']>(`/api/v1/trips/${id}/participants/`), getJson<Schedule[]>(`/api/v1/trips/${id}/schedules/`)])
  return { ...trip, description:'함께 만드는 우리만의 여행 루트', members, schedules }
}

export async function addSchedule(tripId: string, schedule: Omit<Schedule,'id'>) {
  if (!hasApiServer()) return { ...schedule, id:crypto.randomUUID() }
  return postJson<Schedule, Omit<Schedule,'id'>>(`/api/v1/trips/${tripId}/schedules/`, schedule)
}
export async function updateSchedule(schedule: Schedule) {
  if (!hasApiServer()) return schedule
  return patchJson<Schedule, Schedule>(`/api/v1/schedules/${schedule.id}/`, schedule)
}
export async function removeSchedule(scheduleId: string) {
  if (!hasApiServer()) return
  await deleteJson(`/api/v1/schedules/${scheduleId}/`)
}
