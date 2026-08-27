import { useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/layout/Header'

export function SharePage({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return <main className="simple-page"><Header /><section className="center-card"><p className="eyebrow">TRIP CREATED</p><h1>여행이 만들어졌어요!</h1><p>아래 링크를 여행원들에게 공유하면 함께 여행을 준비할 수 있어요.</p><div className="share-box"><span>{url}</span><button className="primary-button" onClick={copy}>{copied ? '복사됨' : '▣ 복사'}</button></div><Link className="text-button" to="/">다른 여행 만들기</Link></section></main>
}
