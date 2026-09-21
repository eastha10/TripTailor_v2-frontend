import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/layout/Header'
import { ScheduleCard } from '../components/workspace/ScheduleCard'
import { ScheduleDialog } from '../components/workspace/ScheduleDialog'
import { generateTripItinerary } from '../services/tripService'
import { addSchedule, getTeamSpace, removeSchedule, updateSchedule } from '../services/workspaceService'
import type { Schedule, ScheduleDraft, TeamSpaceDetail } from '../types/workspace'

type AiFeedback = { kind: 'error' | 'success'; message: string }

export function WorkspacePage({ tripId }: { tripId: string }) {
  const [space, setSpace] = useState<TeamSpaceDetail | null>(null)
  const [editing, setEditing] = useState<Schedule | null | undefined>(undefined)
  const [error, setError] = useState('')
  const [generatingAi, setGeneratingAi] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null)

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

  async function generateAiSchedule() {
    if (!space || space.role !== 'MANAGER' || generatingAi) return
    const hasAiSchedules = space.schedules.some(schedule => schedule.sourceType === 'AI')
    if (hasAiSchedules && !window.confirm('기존 AI 추천 일정을 새 결과로 바꿀까요? 수동으로 추가한 일정은 유지됩니다.')) return

    setGeneratingAi(true)
    setAiFeedback(null)
    try {
      const result = await generateTripItinerary(tripId)
      if (result.status === 'FAILED') throw new Error(result.error || 'AI가 일정을 생성하지 못했습니다.')
      if (result.status === 'NEEDS_INPUT') {
        const details = result.unresolvedIssues?.filter(Boolean).join(' ') || '참여자 선호 정보를 더 입력해 주세요.'
        throw new Error(details)
      }

      const refreshedSpace = await getTeamSpace(tripId)
      setSpace(refreshedSpace)
      if (!refreshedSpace.schedules.some(schedule => schedule.sourceType === 'AI')) {
        throw new Error('AI 추천 결과가 저장되지 않았습니다. 잠시 후 다시 시도해 주세요.')
      }
      setAiFeedback({ kind: 'success', message: 'AI 추천 일정을 생성했습니다.' })
    } catch (cause) {
      setAiFeedback({
        kind: 'error',
        message: cause instanceof Error ? cause.message : 'AI 추천 일정을 생성하지 못했습니다.',
      })
    } finally {
      setGeneratingAi(false)
    }
  }

  if (error) return <main className="workspace-page"><Header /><div className="workspace-state error">{error}</div></main>
  if (!space) return <main className="workspace-page"><Header /><div className="workspace-state">팀스페이스를 불러오는 중…</div></main>

  const defaultDate = dates.at(-1) ?? new Date().toISOString().slice(0, 10)

  const hasAiSchedules = space.schedules.some(schedule => schedule.sourceType === 'AI')

  return <main className="workspace-page"><Header /><div className="workspace-shell"><aside className="workspace-sidebar"><Link className="back-link" to="/mypage">← 마이페이지</Link><div className="workspace-summary"><p className="eyebrow">TEAM SPACE</p><h1>{space.title}</h1><p>{space.description}</p><dl><div><dt>여행지</dt><dd>{space.destination}</dd></div><div><dt>일정</dt><dd>{space.dateLabel}</dd></div></dl></div><section className="member-section"><div className="member-heading"><h2>함께하는 사람</h2><span>{space.members.length}명</span></div><ul>{space.members.map(member => <li key={member.id}><span className="member-avatar">{member.name.slice(0, 1)}</span><strong>{member.name}</strong>{member.role === 'MANAGER' && <em>관리자</em>}</li>)}</ul></section><p className="collaboration-note">이 팀스페이스의 모든 구성원이 루트를 추가하고 변경할 수 있어요.</p></aside><section className="route-panel"><header className="route-header"><div><p className="eyebrow">SHARED ROUTE</p><h2>우리의 여행 루트</h2><p>함께 채우고 바꾸며 우리만의 일정을 완성해 보세요.</p></div><div className="route-actions">{space.role === 'MANAGER' && <button className="ai-recommend-button" type="button" disabled={generatingAi} aria-busy={generatingAi} onClick={generateAiSchedule}>{generatingAi ? 'AI 일정 생성 중…' : hasAiSchedules ? '✦ AI 일정 다시 추천' : '✦ AI 일정 추천'}</button>}<button className="primary-button" type="button" onClick={() => setEditing(null)}>＋ 루트 추가</button></div></header>{aiFeedback && <p className={`ai-feedback ${aiFeedback.kind}`} role={aiFeedback.kind === 'error' ? 'alert' : 'status'}>{aiFeedback.message}</p>}<div className="timeline">{dates.map((date, index) => { const schedules = space.schedules.filter(item => item.date === date).sort((left, right) => left.orderIndex - right.orderIndex || (left.startTime ?? '').localeCompare(right.startTime ?? '')); return <section className="route-day" key={date}><div className="day-marker"><strong>DAY {index + 1}</strong><span>{date}</span></div><div className="day-schedules">{schedules.map(schedule => <ScheduleCard key={schedule.scheduleId} schedule={schedule} onEdit={setEditing} onRemove={deleteSchedule} />)}</div></section> })}</div><button className="floating-add" onClick={() => setEditing(null)} aria-label="루트 추가">＋</button></section></div>{editing !== undefined && <ScheduleDialog key={editing?.scheduleId ?? 'new'} schedule={editing} defaultDate={defaultDate} onClose={() => setEditing(undefined)} onSave={saveSchedule} />}</main>
}
