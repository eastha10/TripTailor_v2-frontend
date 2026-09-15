import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Brand } from './Brand'
import { isAuthenticated, logout } from '../../services/authService'

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const navigate = useNavigate()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * .72)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  async function signOut() {
    await logout()
    setAuthenticated(false)
    navigate('/')
  }
  return <header className={`site-header ${overlay ? 'header-fixed' : ''} ${overlay && !scrolled ? 'header-overlay' : ''}`}><Link to="/" aria-label="TripTailor 홈"><Brand /></Link><nav aria-label="사용자 메뉴"><button className="language" type="button"><span>EN</span> / KO</button>{authenticated ? <><Link className="mypage-link" to="/mypage">마이페이지</Link><button className="avatar-button" type="button" onClick={signOut} title="로그아웃">나</button></> : <Link className="login-button" to="/login">로그인</Link>}</nav></header>
}
