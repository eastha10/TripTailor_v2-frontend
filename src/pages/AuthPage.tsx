import { useState } from 'react'
import type { FormEvent } from 'react'
import heroImage from '../assets/triptailor-hero.png'
import { Brand } from '../components/layout/Brand'
import { login, signup } from '../services/authService'
import type { AuthMode } from '../types/auth'

export function AuthPage({ initialMode, next }: { initialMode: AuthMode; next: string }) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', success: false })

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode); setMessage({ text: '', success: false }); setPassword(''); setPasswordConfirm('')
    window.history.replaceState({}, '', `/?auth=${nextMode}&next=${encodeURIComponent(next)}`)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (mode === 'signup' && password !== passwordConfirm) { setMessage({ text: '비밀번호가 일치하지 않습니다.', success: false }); return }
    if (password.length < 8) { setMessage({ text: '비밀번호는 8자 이상 입력해 주세요.', success: false }); return }
    setLoading(true); setMessage({ text: '', success: false })
    try {
      if (mode === 'signup') { await signup({ name, email, password }); changeMode('login'); setMessage({ text: '가입이 완료됐어요. 이제 로그인해 주세요.', success: true }); return }
      await login({ email, password }); window.location.assign(next)
    } catch (cause) { setMessage({ text: cause instanceof Error ? cause.message : '잠시 후 다시 시도해 주세요.', success: false }) }
    finally { setLoading(false) }
  }

  return <main className="auth-page"><a className="auth-brand" href="/"><Brand /></a><section className="auth-visual" style={{ backgroundImage: `linear-gradient(180deg,rgba(10,30,21,.2),rgba(10,30,21,.6)),url(${heroImage})` }}><div><p className="eyebrow">JOURNEYS BEGIN HERE</p><h1>여행의 시작을<br />함께할게요.</h1><p>나만의 취향으로 완성하는 여행, TripTailor</p></div></section><section className="auth-panel"><div className="auth-box"><div className="auth-heading"><p className="eyebrow">WELCOME TO TRIPTAILOR</p><h2>{mode === 'login' ? '다시 만나서 반가워요' : '여행을 시작해 볼까요?'}</h2><p>{mode === 'login' ? '계정에 로그인하고 여행을 이어가세요.' : '간단한 정보만 입력하면 바로 시작할 수 있어요.'}</p></div><div className="auth-tabs" role="tablist"><button className={mode === 'login' ? 'active' : ''} onClick={() => changeMode('login')} type="button">로그인</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => changeMode('signup')} type="button">회원가입</button></div><form className="auth-form" onSubmit={submit}>
    {mode === 'signup' && <label><span>이름 또는 닉네임</span><input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="여행에서 사용할 이름" required /></label>}
    <label><span>이메일</span><input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required /></label>
    <label><span>비밀번호</span><div className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="8자 이상 입력" minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '숨김' : '보기'}</button></div></label>
    {mode === 'signup' && <label><span>비밀번호 확인</span><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder="비밀번호를 한 번 더 입력" minLength={8} required /></label>}
    {mode === 'login' && <div className="auth-options"><label><input type="checkbox" /> 로그인 상태 유지</label><button type="button">비밀번호를 잊으셨나요?</button></div>}
    {message.text && <p className={message.success ? 'auth-success' : 'auth-error'} role="alert">{message.text}</p>}
    <button className="primary-button auth-submit" disabled={loading}>{loading ? '처리 중…' : mode === 'login' ? '로그인' : '회원가입'}</button>
  </form><p className="auth-switch">{mode === 'login' ? '아직 계정이 없나요?' : '이미 계정이 있나요?'} <button type="button" onClick={() => changeMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? '회원가입' : '로그인'}</button></p></div></section></main>
}
