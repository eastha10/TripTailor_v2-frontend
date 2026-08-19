export type TeamSpace = { id: string; title: string; destination: string; dateLabel: string; memberCount: number; role: 'MANAGER' | 'MEMBER'; status: 'PLANNING' | 'UPCOMING' | 'DONE' }
export type Member = { id: string; name: string; role: 'MANAGER' | 'MEMBER' }
export type Schedule = { id: string; day: number; date: string; time: string; title: string; location: string; note: string }
export type TeamSpaceDetail = TeamSpace & { description: string; members: Member[]; schedules: Schedule[] }
