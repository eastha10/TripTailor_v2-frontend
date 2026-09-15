import { Link } from 'react-router'
import type { TeamSpace } from '../../types/workspace'
import { PeopleIcon } from '../icons/TripIcons'

const statusLabel = { COLLECTING_RESPONSES: '응답 수집 중', PLANNING: '계획 중', READY: '준비 완료' }

export function TeamSpaceCard({ space }: { space: TeamSpace }) {
  return <Link className="space-card" to={`/trips/${space.id}`}><div className={`space-cover status-${space.status.toLowerCase()}`}><span>{statusLabel[space.status]}</span><strong>{space.destination}</strong></div><div className="space-card-body"><div className="space-card-title"><h3>{space.title}</h3>{space.role === 'MANAGER' && <span className="manager-badge">관리자</span>}</div><p>{space.dateLabel}</p><div className="space-meta"><span><PeopleIcon className="meta-icon" />{space.memberCount}명</span><span>팀스페이스 열기 →</span></div></div></Link>
}
