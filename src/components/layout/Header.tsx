import { useEffect, useState } from 'react'
import { Brand } from './Brand'

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * .72)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <header className={`site-header ${overlay && !scrolled ? 'header-overlay' : ''}`}><a href="/" aria-label="TripTailor 홈"><Brand /></a><nav aria-label="사용자 메뉴"><button className="language" type="button"><span>EN</span> / KO</button><a className="login-button" href="/?auth=login">로그인</a></nav></header>
}
