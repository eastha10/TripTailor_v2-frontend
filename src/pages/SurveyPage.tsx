import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Brand } from '../components/layout/Brand'
import { Header } from '../components/layout/Header'
import { ChoiceCard } from '../components/survey/ChoiceCard'
import { SurveyInput } from '../components/survey/SurveyInput'
import { getCurrentUser, isAuthenticated } from '../services/authService'
import { acceptInvitation, getInvitation } from '../services/invitationService'
import { createPreference } from '../services/preferenceService'
import { getTrip } from '../services/tripService'
import type { Invitation } from '../types/invitation'
import type { AccommodationType, BudgetBand, PreferencePayload } from '../types/preference'

const budgetChoices: { label: string; value: BudgetBand }[] = [
  { label: '20만원 이하', value: 'UP_TO_200000_KRW' },
  { label: '20~40만원', value: 'FROM_200000_TO_400000_KRW' },
  { label: '40~60만원', value: 'FROM_400000_TO_600000_KRW' },
  { label: '60만원 이상', value: 'OVER_600000_KRW' },
  { label: '상관없어요', value: 'NO_PREFERENCE' },
]
const accommodationChoices: { label: string; value: AccommodationType }[] = [
  { label: '호텔', value: 'HOTEL' },
  { label: '리조트/풀빌라', value: 'RESORT_OR_POOL_VILLA' },
  { label: '감성 숙소/펜션', value: 'EMOTIONAL_STAY_OR_PENSION' },
  { label: '게스트하우스', value: 'GUESTHOUSE' },
  { label: '상관없어요', value: 'NO_PREFERENCE' },
]

function formValue(form: FormData, key: string) {
  const value = form.get(key)
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function SurveyPage({ inviteCode }: { inviteCode: string }) {
  const navigate = useNavigate()
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [acceptedTripId, setAcceptedTripId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [joining, setJoining] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadInvitation() {
      try {
        const invite = await getInvitation(inviteCode)
        if (!active) return
        setInvitation(invite)

        if (!isAuthenticated()) return
        try {
          const [trip, user] = await Promise.all([getTrip(invite.tripId), getCurrentUser()])
          if (active && trip.ownerId === user.userId) {
            setIsOwner(true)
            setAcceptedTripId(invite.tripId)
          }
        } catch {
          // 일반 초대 사용자는 아직 여행 조회 권한이 없을 수 있으므로 참여 화면을 계속 보여준다.
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : '초대 정보를 불러오지 못했습니다.')
      } finally {
        if (active) setCheckingAccess(false)
      }
    }

    loadInvitation()
    return () => { active = false }
  }, [inviteCode])

  async function joinTrip() {
    if (!isAuthenticated()) {
      navigate(`/login?next=${encodeURIComponent(`/trip/${inviteCode}`)}`)
      return
    }
    setJoining(true)
    setError('')
    try {
      const accepted = await acceptInvitation(inviteCode)
      setAcceptedTripId(accepted.tripId)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '초대를 수락하지 못했습니다.')
    } finally {
      setJoining(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!acceptedTripId) return
    const form = new FormData(event.currentTarget)
    const displayName = formValue(form, 'displayName')
    if (!displayName) return

    const payload: PreferencePayload = {
      displayName,
      availableDateText: formValue(form, 'availableDateText'),
      budgetBand: formValue(form, 'budgetBand') as BudgetBand | undefined,
      accommodationType: formValue(form, 'accommodationType') as AccommodationType | undefined,
      mustHaves: formValue(form, 'mustHaves'),
      additionalNotes: formValue(form, 'additionalNotes'),
    }

    setSubmitting(true)
    setError('')
    try {
      await createPreference(acceptedTripId, payload)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '응답을 제출하지 못했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return <main className="simple-page"><Header /><section className="center-card"><p className="eyebrow">ALL SET</p><h1>응답을 제출했어요!</h1><p>모두의 취향이 모이면 TripTailor가 꼭 맞는 여행을 준비할게요.</p><Link className="primary-button link-button" to={acceptedTripId ? `/trips/${acceptedTripId}` : '/'}>여행 보기</Link></section></main>

  if (checkingAccess || !invitation) return <main className="simple-page"><Header /><section className="center-card"><p>{error || '초대 정보를 불러오는 중…'}</p></section></main>

  if (!acceptedTripId) {
    return <main className="simple-page"><Header /><section className="center-card invitation-card"><p className="eyebrow">YOU ARE INVITED</p><h1>{invitation.regionName} 여행에<br />초대되었어요</h1><dl><div><dt>여행 기간</dt><dd>{invitation.travelPeriod.startDate} ~ {invitation.travelPeriod.endDate}</dd></div><div><dt>모집 인원</dt><dd>최대 {invitation.participantLimit}명</dd></div></dl>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="button" disabled={joining} onClick={joinTrip}>{joining ? '참여 중…' : '여행에 참여하기'}</button></section></main>
  }

  return <main className="survey-page"><Header /><form className="survey" onSubmit={submit}><section className="invite-intro"><p>{isOwner ? '호스트님의 선호도를 알려주세요' : '여행 참여가 완료되었어요'}</p><h1><Brand /></h1><p>{invitation.regionName} 여행을 더 잘 맞추기 위해 몇 가지만 알려주세요.</p><span className="people-pill">최대 {invitation.participantLimit}명</span></section><SurveyInput title="이름 또는 닉네임" name="displayName" required placeholder="예: 지민" /><SurveyInput title="참여 가능한 날짜가 있나요?" name="availableDateText" placeholder="예: 9월 셋째 주 주말, 추석 연휴 등" /><ChoiceCard title="1인 예산은 어느 정도가 좋을까요?" name="budgetBand" choices={budgetChoices} /><ChoiceCard title="선호하는 숙소는?" name="accommodationType" choices={accommodationChoices} /><SurveyInput title="꼭 가고 싶은 곳이나 하고 싶은 게 있나요?" name="mustHaves" placeholder="가고 싶은 장소, 먹고 싶은 음식 등 자유롭게 적어주세요" /><SurveyInput title="그 외 하고 싶은 말" name="additionalNotes" placeholder="알레르기, 이동 제약, 기타 요청사항 등" />{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button submit-button" disabled={submitting}>{submitting ? '제출 중…' : '제출하기'}</button></form></main>
}
