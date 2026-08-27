import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/layout/Header'
import { ScheduleCard } from '../components/workspace/ScheduleCard'
import { ScheduleDialog } from '../components/workspace/ScheduleDialog'
import { addSchedule, getTeamSpace, removeSchedule, updateSchedule } from '../services/workspaceService'
import type { Schedule, ScheduleDraft, TeamSpaceDetail } from '../types/workspace'

export function WorkspacePage({ tripId }: { tripId: string }) {
  const [space, setSpace] = useState<TeamSpaceDetail | null>(null)
  const [editing, setEditing] = useState<Schedule | null | undefined>(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    getTeamSpace(tripId)
      .then(setSpace)
      .catch(cause => setError(cause instanceof Error ? cause.message : '팀스페이스를 불러오지 못했습니다.'))
  }, [tripId])

  const dates = useMemo(
    () => space ? [...new Set(space.schedules.map(item => item.date))].sort() : [],
    [space],
  )

  async function saveSchedule(scheduleId: string | null, draft: ScheduleDraft) {
    if (!space) return
    const saved = scheduleId
      ? await updateSchedule(scheduleId, draft)
      : await addSchedule(tripId, draft)
    setSpace({
      ...space,
      schedules: scheduleId
        ? space.schedules.map(item => item.scheduleId === scheduleId ? saved : item)
        : [...space.schedules, saved],
    })
  }

  async function deleteSchedule(scheduleId: string) {
    if (!space || !window.confirm('이 루트를 삭제할까요?')) return
    await removeSchedule(scheduleId)
    setSpace({ ...space, schedules: space.schedules.filter(item => item.scheduleId !== scheduleId) })
  }

  if (error) return <main className="workspace-page"><Header /><div className="workspace-state error">{error}</div></main>
  if (!space) return <main className="workspace-page"><Header /><div className="workspace-state">팀스페이스를 불러오는 중…</div></main>

  const defaultDate = dates.at(-1) ?? new Date().toISOString().slice(0, 10)

  return <main className="workspace-page"><Header /><div className="workspace-shell"><aside className="workspace-sidebar"><Link className="back-link" to="/mypage">← 마이페이지</Link><div className="workspace-summary"><p className="eyebrow">TEAM SPACE</p><h1>{space.title}</h1><p>{space.description}</p><dl><div><dt>여행지</dt><dd>{space.destination}</dd></div><div><dt>일정</dt><dd>{space.dateLabel}</dd></div></dl></div><section className="member-section"><div className="member-heading"><h2>함께하는 사람</h2><span>{space.members.length}명</span></div><ul>{space.members.map(member => <li key={member.id}><span className="member-avatar">{member.name.slice(0, 1)}</span><strong>{member.name}</strong>{member.role === 'MANAGER' && <em>관리자</em>}</li>)}</ul></section><p className="collaboration-note">이 팀스페이스의 모든 구성원이 루트를 추가하고 변경할 수 있어요.</p></aside><section className="route-panel"><header className="route-header"><div><p className="eyebrow">SHARED ROUTE</p><h2>우리의 여행 루트</h2><p>함께 채우고 바꾸며 우리만의 일정을 완성해 보세요.</p></div><button className="primary-button" onClick={() => setEditing(null)}>＋ 루트 추가</button></header><div className="timeline">{dates.map((date, index) => { const schedules = space.schedules.filter(item => item.date === date).sort((left, right) => left.orderIndex - right.orderIndex || (left.startTime ?? '').localeCompare(right.startTime ?? '')); return <section className="route-day" key={date}><div className="day-marker"><strong>DAY {index + 1}</strong><span>{date}</span></div><div className="day-schedules">{schedules.map(schedule => <ScheduleCard key={schedule.scheduleId} schedule={schedule} onEdit={setEditing} onRemove={deleteSchedule} />)}</div></section> })}</div><button className="floating-add" onClick={() => setEditing(null)} aria-label="루트 추가">＋</button></section></div>{editing !== undefined && <ScheduleDialog key={editing?.scheduleId ?? 'new'} schedule={editing} defaultDate={defaultDate} onClose={() => setEditing(undefined)} onSave={saveSchedule} />}</main>
}
