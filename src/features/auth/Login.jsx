import { useState } from 'react'
import { saveToken } from '../../lib/api'

function Login({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (isRegister && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Không thể xác thực.')
      saveToken(data.access_token)
      onAuthenticated(data)
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Không kết nối được backend. Hãy chạy app.py.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-page">
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-logo">U</div>
      <p className="auth-kicker">SMART HOME IOT</p>
      <h1>{isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}</h1>
      <label>USERNAME<input value={username} onChange={(e) => setUsername(e.target.value)} minLength="3" maxLength="50" autoComplete="username" required /></label>
      <label>MẬT KHẨU<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" autoComplete={isRegister ? 'new-password' : 'current-password'} required /></label>
      {isRegister && <label>XÁC NHẬN MẬT KHẨU<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength="6" autoComplete="new-password" required /></label>}
      {error && <p className="auth-error">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'ĐANG XỬ LÝ...' : isRegister ? 'TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP'}</button>
      <button className="auth-switch" type="button" onClick={() => { setMode(isRegister ? 'login' : 'register'); setError('') }}>
        {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
      </button>
    </form>
  </main>
}

export default Login
