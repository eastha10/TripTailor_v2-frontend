import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/layout/Header'

function normalizeInviteUrl(url: string) {
  try {
    const inviteUrl = new URL(url, window.location.origin)
    return new URL(`${inviteUrl.pathname}${inviteUrl.search}${inviteUrl.hash}`, window.location.origin).toString()
  } catch {
    return url
  }
}

export function SharePage({ url }: { url: string }) {
  const shareUrl = normalizeInviteUrl(url)
  const linkInput = useRef<HTMLInputElement>(null)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  async function copy() {
    setCopyStatus('idle')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API is unavailable')
      await navigator.clipboard.writeText(shareUrl)
      setCopyStatus('copied')
    } catch {
      const input = linkInput.current
      if (!input) {
        setCopyStatus('error')
        return
      }
      input.focus()
      input.select()
      try {
        setCopyStatus(document.execCommand('copy') ? 'copied' : 'error')
      } catch {
        setCopyStatus('error')
      }
    }
  }

  return <main className="simple-page"><Header /><section className="center-card"><p className="eyebrow">TRIP CREATED</p><h1>여행이 만들어졌어요!</h1><p>아래 링크를 여행원들에게 공유하면 함께 여행을 준비할 수 있어요.</p><div className="share-box"><input ref={linkInput} aria-label="여행 초대 링크" readOnly value={shareUrl} onFocus={event => event.currentTarget.select()} /><button className="primary-button" type="button" onClick={copy}>{copyStatus === 'copied' ? '복사됨' : '링크 복사'}</button></div><p className={copyStatus === 'error' ? 'copy-status form-error' : 'copy-status'} aria-live="polite">{copyStatus === 'copied' ? '초대 링크를 복사했습니다.' : copyStatus === 'error' ? '자동 복사에 실패했습니다. 링크를 선택해 직접 복사해 주세요.' : ''}</p><div className="share-actions"><a className="primary-button link-button" href={shareUrl}>내 선호도 작성하기</a><Link className="text-button" to="/">다른 여행 만들기</Link></div></section></main>
}
