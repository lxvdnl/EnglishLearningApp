import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'

const THEMES = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'forest',   label: 'Forest'   },
  { id: 'lavender', label: 'Lavender' },
  { id: 'sunrise',  label: 'Sunrise'  },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const { theme, setTheme } = useThemeStore()

  // Закрываем при клике вне дропдауна
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <header className="header">
      <span className="header-logo" onClick={() => navigate('/')}>
        English Learning
      </span>

      <div className="dropdown-wrapper" ref={dropdownRef}>
        <button
          className="header-settings-btn"
          onClick={() => setOpen((v) => !v)}
        >
          Settings
        </button>

        {open && (
          <div className="dropdown">
            <p className="dropdown-label">Theme</p>
            <div className="theme-grid">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                  data-theme-preview={t.id}
                  onClick={() => setTheme(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="dropdown-divider" />

            <button className="btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}