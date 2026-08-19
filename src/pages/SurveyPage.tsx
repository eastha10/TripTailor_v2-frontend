import { useState } from 'react'
import type { FormEvent } from 'react'
import { Brand } from '../components/layout/Brand'
import { Header } from '../components/layout/Header'
import { ChoiceCard } from '../components/survey/ChoiceCard'
import { SurveyInput } from '../components/survey/SurveyInput'

export function SurveyPage({ people }: { people: number }) {
  const [submitted, setSubmitted] = useState(false)
  function submit(event: FormEvent) { event.preventDefault(); setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  if (submitted) return <main className="simple-page"><Header /><section className="center-card"><p className="eyebrow">ALL SET</p><h1>응답을 제출했어요!</h1><p>모두의 취향이 모이면 TripTailor가 꼭 맞는 여행을 준비할게요.</p><a className="primary-button link-button" href="/">홈으로</a></section></main>
  return <main className="survey-page"><Header /><form className="survey" onSubmit={submit}><section className="invite-intro"><p>여행에 초대되었어요</p><h1><Brand /></h1><p>함께 갈 여행을 더 잘 맞추기 위해 몇 가지만 알려주세요.</p><span className="people-pill">♧ {people}명</span></section><SurveyInput title="이름 또는 닉네임" required placeholder="예: 지민" /><SurveyInput title="참여 가능한 날짜가 있나요?" placeholder="예: 9월 셋째 주 주말, 추석 연휴 등" /><ChoiceCard title="1인 예산은 어느 정도가 좋을까요?" name="budget" choices={['20만원 이하', '20~40만원', '40~60만원', '60만원 이상', '상관없어요']} /><ChoiceCard title="선호하는 숙소는?" name="stay" choices={['호텔', '리조트/풀빌라', '감성 숙소/펜션', '게스트하우스', '상관없어요']} /><SurveyInput title="꼭 가고 싶은 곳이나 하고 싶은 게 있나요?" placeholder="가고 싶은 장소, 먹고 싶은 음식 등 자유롭게 적어주세요" /><SurveyInput title="그 외 하고 싶은 말" placeholder="알레르기, 이동 제약, 기타 요청사항 등" /><button className="primary-button submit-button">제출하기</button></form></main>
}
