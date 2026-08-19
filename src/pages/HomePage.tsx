import { useState } from 'react'
import heroImage from '../assets/triptailor-hero.png'
import { Header } from '../components/layout/Header'
import { Planner } from '../features/trips/Planner'
import { SharePage } from './SharePage'

export function HomePage() {
  const [shareUrl, setShareUrl] = useState('')
  if (shareUrl) return <SharePage url={shareUrl} onReset={() => setShareUrl('')} />
  return <main><section className="hero-section" style={{ backgroundImage: `linear-gradient(180deg,rgba(7,20,16,.25),rgba(7,20,16,.55)),url(${heroImage})` }}><Header overlay /><div className="hero-content"><p className="eyebrow">MAKE YOUR OWN PATH</p><h1>TripTailor</h1><p>당신의 여행을 디자인하세요</p></div><a className="scroll-cue" href="#planner"><span /><small>아래로 스크롤</small><b>⌄</b></a></section><Planner onCreated={setShareUrl} /></main>
}
