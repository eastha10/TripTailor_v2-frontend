import type { Schedule } from '../../types/workspace'

type ScheduleCardProps = { schedule: Schedule; onEdit: (schedule: Schedule) => void; onRemove: (id: string) => void }

export function ScheduleCard({ schedule, onEdit, onRemove }: ScheduleCardProps) {
  return <article className="schedule-card"><div className="schedule-time">{schedule.time}</div><div className="schedule-content"><div><p className="schedule-location">⌖ {schedule.location}</p><h3>{schedule.title}</h3><p>{schedule.note}</p></div><div className="schedule-actions"><button type="button" onClick={() => onEdit(schedule)}>수정</button><button type="button" onClick={() => onRemove(schedule.id)}>삭제</button></div></div></article>
}
