export type TeamSpaceStatus = 'COLLECTING_RESPONSES' | 'PLANNING' | 'READY'
export type TeamSpace = { id: string; title: string; destination: string; dateLabel: string; memberCount: number; role: 'MANAGER' | 'MEMBER'; status: TeamSpaceStatus }
export type Member = { id: string; name: string; profileImageUrl?: string | null; role: 'MANAGER' | 'MEMBER' }

export type Schedule = {
  createdAt?: string
  createdBy?: string
  date: string
  description: string | null
  endTime: string | null
  isFixed: boolean
  orderIndex: number
  place: string | null
  scheduleId: string
  sourceType: 'AI' | 'MANUAL'
  startTime: string | null
  title: string
  tripId?: string
  updatedAt?: string
}

export type ScheduleDraft = {
  date: string
  description?: string | null
  endTime?: string | null
  isFixed?: boolean
  orderIndex?: number
  place?: string | null
  startTime?: string | null
  title: string
}

export type TeamSpaceDetail = TeamSpace & { description: string; members: Member[]; schedules: Schedule[] }
