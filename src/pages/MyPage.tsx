import { useEffect, useState } from 'react'
import { Header } from '../components/layout/Header'
import { TeamSpaceCard } from '../components/workspace/TeamSpaceCard'
import { getTeamSpaces } from '../services/workspaceService'
import type { TeamSpace } from '../types/workspace'

export function MyPage() {
  const [spaces, setSpaces] = useState<TeamSpace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const name = sessionStorage.getItem('triptailor_user_name') || '여행자'
  useEffect(() => { getTeamSpaces().then(setSpaces).catch(cause => setError(cause instanceof Error ? cause.message : '여행을 불러오지 못했습니다.')).finally(() => setLoading(false)) }, [])
  return <main className="mypage"><Header /><div className="mypage-inner"><section className="profile-panel"><div className="profile-avatar">{name.slice(0,1).toUpperCase()}</div><div><p className="eyebrow">MY TRIPTAILOR</p><h1>{name}님의 여행</h1><p>함께 계획하고 있는 팀스페이스를 한곳에서 확인하세요.</p></div><a className="primary-button new-trip-button" href="/#planner">＋ 새 여행 만들기</a></section><section className="spaces-section"><div className="section-heading"><div><p className="eyebrow">TEAM SPACES</p><h2>나의 팀스페이스</h2></div><span>{spaces.length}개의 여행</span></div>{loading && <div className="workspace-state">여행을 불러오는 중…</div>}{error && <div className="workspace-state error">{error}</div>}{!loading && !error && <div className="space-grid">{spaces.map(space => <TeamSpaceCard key={space.id} space={space} />)}<a className="empty-space-card" href="/#planner"><span>＋</span><strong>새 여행 만들기</strong><p>새로운 팀스페이스를 시작하세요</p></a></div>}</section></div></main>
}
