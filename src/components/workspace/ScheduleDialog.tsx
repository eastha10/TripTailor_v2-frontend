import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Schedule, ScheduleDraft } from '../../types/workspace'

type ScheduleDialogProps = {
  schedule: Schedule | null
  defaultDate: string
  onClose: () => void
  onSave: (scheduleId: string | null, draft: ScheduleDraft) => Promise<void>
}

export function ScheduleDialog({ schedule, defaultDate, onClose, onSave }: ScheduleDialogProps) {
  const [draft, setDraft] = useState<ScheduleDraft>(() => ({
    date: schedule?.date ?? defaultDate,
    startTime: schedule?.startTime ?? '09:00',
    endTime: schedule?.endTime ?? null,
    title: schedule?.title ?? '',
    place: schedule?.place ?? '',
    description: schedule?.description ?? '',
    orderIndex: schedule?.orderIndex,
    isFixed: schedule?.isFixed ?? false,
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(schedule?.scheduleId ?? null, draft)
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '일정을 저장하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="schedule-dialog" role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title" onMouseDown={event => event.stopPropagation()}><header><div><p className="eyebrow">EDIT TOGETHER</p><h2 id="schedule-dialog-title">{schedule ? '루트 수정하기' : '루트 추가하기'}</h2></div><button className="dialog-close" type="button" onClick={onClose} aria-label="닫기">×</button></header><form onSubmit={submit}><div className="dialog-row"><label><span>날짜</span><input type="date" value={draft.date} onChange={event => setDraft({ ...draft, date: event.target.value })} required /></label><label><span>시작 시간</span><input type="time" value={draft.startTime ?? ''} onChange={event => setDraft({ ...draft, startTime: event.target.value || null })} /></label><label><span>종료 시간</span><input type="time" value={draft.endTime ?? ''} onChange={event => setDraft({ ...draft, endTime: event.target.value || null })} /></label></div><label><span>일정 제목</span><input value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="무엇을 할까요?" required /></label><label><span>장소</span><input value={draft.place ?? ''} onChange={event => setDraft({ ...draft, place: event.target.value || null })} placeholder="장소 이름" /></label><label><span>메모</span><textarea value={draft.description ?? ''} onChange={event => setDraft({ ...draft, description: event.target.value || null })} placeholder="준비물이나 함께 알아둘 내용" /></label><label className="radio-row"><input type="checkbox" checked={draft.isFixed ?? false} onChange={event => setDraft({ ...draft, isFixed: event.target.checked })} /><span>변경하면 안 되는 고정 일정</span></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="dialog-buttons"><button type="button" onClick={onClose}>취소</button><button className="primary-button" disabled={saving}>{saving ? '저장 중…' : '저장하기'}</button></div></form></section></div>
}
