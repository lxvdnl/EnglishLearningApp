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

const currentThemeLabel = (id) => THEMES.find((t) => t.id === id)?.label ?? id

export default function Header() {
  const [open, setOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const { theme, setTheme } = useThemeStore()

  // Закрываем при клике вне дропдауна
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setThemeOpen(false)
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
          onClick={() => { setOpen((v) => !v); setThemeOpen(false) }}
        >
          Settings
        </button>

        {open && (
          <div className="dropdown">
            {/* ── Theme row ── */}
            <button
              className="dropdown-menu-item"
              onClick={() => setThemeOpen((v) => !v)}
            >
              <span className="dropdown-menu-item-label">Theme</span>
              <span className="dropdown-menu-item-right">
                <span className="dropdown-menu-item-value">{currentThemeLabel(theme)}</span>
                <svg
                  className={`dropdown-chevron ${themeOpen ? 'open' : ''}`}
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>

            {themeOpen && (
              <div className="theme-list">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`theme-list-item ${theme === t.id ? 'active' : ''}`}
                    data-theme-preview={t.id}
                    onClick={() => { setTheme(t.id); setThemeOpen(false) }}
                  >
                    <span className="theme-list-dot" data-theme-preview={t.id} />
                    {t.label}
                    {theme === t.id && (
                      <svg className="theme-list-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

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