import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, registerApi } from '../api/auth.api'
import useAuthStore from '../store/authStore'
import { AVATARS } from '../utils/emojis'

export default function AuthPage() {
  const [isLogin, setIsLogin]   = useState(true)
  const [step, setStep]         = useState(1)   // 1 = credentials, 2 = emoji pick
  const [login, setLogin]       = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar]     = useState(AVATARS[0])
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const setAuth  = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const goToEmojiStep = () => {
    setError('')
    if (!login.trim())    return setError('Login is required')
    if (!password.trim()) return setError('Password is required')
    setStep(2)
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await loginApi(login, password)
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await registerApi(login, password, avatar)
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setStep(1)
    setError('')
  }

  // ── Step 2: Emoji picker (register only) ──
  if (!isLogin && step === 2) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <button className="auth-back-btn" onClick={() => setStep(1)}>← Back</button>
          <h1>Pick your emoji</h1>
          <p className="auth-subtitle">This will be your avatar</p>

          <div className="avatar-selected">{avatar}</div>

          <div className="emoji-grid">
            {AVATARS.map((e) => (
              <button
                key={e}
                className={`emoji-btn ${avatar === e ? 'active' : ''}`}
                onClick={() => setAvatar(e)}
              >
                {e}
              </button>
            ))}
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button onClick={handleRegister} disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </div>
      </div>
    )
  }

  // ── Step 1: Login / Register credentials ──
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>English Learning</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back' : 'Create account'}
        </p>

        <div className="auth-fields">
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (isLogin ? handleLogin() : goToEmojiStep())}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          onClick={isLogin ? handleLogin : goToEmojiStep}
          disabled={loading}
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Next →'}
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span onClick={switchMode}>
            {isLogin ? ' Register' : ' Login'}
          </span>
        </p>
      </div>
    </div>
  )
}
