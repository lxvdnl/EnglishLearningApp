import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, registerApi } from '../api/auth.api'
import useAuthStore from '../store/authStore'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const fn = isLogin ? loginApi : registerApi
      const data = await fn(login, password)
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Register' : ' Login'}
          </span>
        </p>
      </div>
    </div>
  )
}