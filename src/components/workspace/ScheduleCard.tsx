import type { Schedule } from '../../types/workspace'

type ScheduleCardProps = { schedule: Schedule; onEdit: (schedule: Schedule) => void; onRemove: (id: string) => void }

export function ScheduleCard({ schedule, onEdit, onRemove }: ScheduleCardProps) {
  return <article className="schedule-card"><div className="schedule-time">{schedule.startTime ?? '시간 미정'}</div><div className="schedule-content"><div>{schedule.place && <p className="schedule-location">⌖ {schedule.place}</p>}<h3>{schedule.title}</h3>{schedule.description && <p>{schedule.description}</p>}</div><div className="schedule-actions"><button type="button" onClick={() => onEdit(schedule)}>수정</button><button type="button" onClick={() => onRemove(schedule.scheduleId)}>삭제</button></div></div></article>
}
