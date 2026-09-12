import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { CalendarIcon, LocationIcon, PeopleIcon } from '../../components/icons/TripIcons'
import { isAuthenticated } from '../../services/authService'
import { createTrip } from '../../services/tripService'
import type { TripDraft } from '../../types/trip'

// v2 명세에 공개된 지역 식별자는 현재 강릉시 한 건이다.
const regions = [{ id: 'a61bbfd8-fa16-46a4-9379-534e09a77e93', name: '강릉시' }]

export function Planner({ onCreated }: { onCreated: (url: string) => void }) {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [draft, setDraft] = useState<TripDraft>({ people: 2, regionId: '', startDate: today, endDate: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!draft.regionId || !draft.startDate || !draft.endDate) { setError('지역과 여행 기간을 모두 선택해 주세요.'); return }
    if (!isAuthenticated()) {
      navigate('/login?next=%2F%23planner')
      return
    }
    setLoading(true); setError('')
    try { onCreated(await createTrip(draft)) }
    catch (cause) { setError(cause instanceof Error ? cause.message : '잠시 후 다시 시도해 주세요.') }
    finally { setLoading(false) }
  }

  return <section className="planner-section" id="planner"><div className="planner-copy"><p className="eyebrow">YOUR JOURNEY, YOUR WAY</p><h2>여행을 계획해 볼까요?</h2><p>인원, 지역, 기간만 알려주시면 나머지는 TripTailor가 맞춰 드릴게요.</p></div><form className="planner-bar" onSubmit={submit}>
    <div className="planner-field people-control"><PeopleIcon className="field-icon" /><div><label>인원</label><div className="stepper"><button type="button" aria-label="인원 줄이기" onClick={() => setDraft({ ...draft, people: Math.max(1, draft.people - 1) })}>−</button><strong>{draft.people}</strong><button type="button" aria-label="인원 늘리기" onClick={() => setDraft({ ...draft, people: Math.min(12, draft.people + 1) })}>＋</button></div></div></div>
    <label className="planner-field"><LocationIcon className="field-icon" /><span><small>지역</small><select value={draft.regionId} onChange={(e) => setDraft({ ...draft, regionId: e.target.value })}><option value="">가고 싶은 지역</option>{regions.map(region => <option key={region.id} value={region.id}>{region.name}</option>)}</select></span></label>
    <div className="planner-field date-field"><CalendarIcon className="field-icon" /><span><small>기간</small><div className="date-inputs"><input aria-label="여행 시작일" type="date" min={today} value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} /><span>–</span><input aria-label="여행 종료일" type="date" min={draft.startDate || today} value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} /></div></span></div>
    <button className="primary-button create-button" disabled={loading}>{loading ? '만드는 중…' : '여행 만들기'} <span>→</span></button>
  </form>{error && <p className="form-error" role="alert">{error}</p>}</section>
}
