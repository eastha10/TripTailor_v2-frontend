import type { TeamSpace } from '../../types/workspace'

const statusLabel = { PLANNING:'계획 중', UPCOMING:'다가오는 여행', DONE:'완료' }

export function TeamSpaceCard({ space }: { space: TeamSpace }) {
  return <a className="space-card" href={`/?trip=${space.id}`}><div className={`space-cover status-${space.status.toLowerCase()}`}><span>{statusLabel[space.status]}</span><strong>{space.destination}</strong></div><div className="space-card-body"><div className="space-card-title"><h3>{space.title}</h3>{space.role === 'MANAGER' && <span className="manager-badge">관리자</span>}</div><p>{space.dateLabel}</p><div className="space-meta"><span>♧ {space.memberCount}명</span><span>팀스페이스 열기 →</span></div></div></a>
}
