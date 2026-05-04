import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import { updateAvatarApi } from '../../api/auth.api'
import { AVATARS } from '../../utils/emojis'

const THEMES = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'forest',   label: 'Forest'   },
  { id: 'lavender', label: 'Lavender' },
  { id: 'sunrise',  label: 'Sunrise'  },
]

const currentThemeLabel = (id) => THEMES.find((t) => t.id === id)?.label ?? id

export default function Header() {
  const [open,        setOpen]        = useState(false)
  const [themeOpen,   setThemeOpen]   = useState(false)
  const [emojiOpen,   setEmojiOpen]   = useState(false)
  const dropdownRef = useRef(null)
  const navigate    = useNavigate()

  const logout   = useAuthStore((s) => s.logout)
  const user     = useAuthStore((s) => s.user)
  const token    = useAuthStore((s) => s.token)
  const setAvatar = useAuthStore((s) => s.setAvatar)
  const { theme, setTheme } = useThemeStore()

  const avatar = user?.avatar ?? '🐣'

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeAll()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const closeAll = () => { setOpen(false); setThemeOpen(false); setEmojiOpen(false) }

  const handleLogout = () => { logout(); navigate('/auth') }

  const handleAvatarSelect = async (e) => {
    setAvatar(e)
    setEmojiOpen(false)
    try {
      const data = await updateAvatarApi(e, token)
      // refresh token in store so JWT stays fresh
      useAuthStore.getState().setAuth(data.user, data.token)
    } catch { /* silent */ }
  }

  return (
    <header className="header">
      <span className="header-logo" onClick={() => navigate('/')}>
        English Learning
      </span>

      <div className="dropdown-wrapper" ref={dropdownRef}>
        {/* Avatar button */}
        <button
          className="header-avatar-btn"
          onClick={() => { setOpen((v) => !v); setThemeOpen(false); setEmojiOpen(false) }}
          aria-label="Settings"
        >
          {avatar}
        </button>

        {open && (
          <div className="dropdown">
            {/* ── Change Emoji ── */}
            <button
              className="dropdown-menu-item"
              onClick={() => setEmojiOpen((v) => !v)}
            >
              <span className="dropdown-menu-item-label">Emoji</span>
              <span className="dropdown-menu-item-right">
                <span className="dropdown-menu-item-value">{avatar}</span>
                <svg
                  className={`dropdown-chevron ${emojiOpen ? 'open' : ''}`}
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>

            {emojiOpen && (
              <div className="emoji-grid-dropdown">
                {AVATARS.map((e) => (
                  <button
                    key={e}
                    className={`emoji-btn ${avatar === e ? 'active' : ''}`}
                    onClick={() => handleAvatarSelect(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            {/* ── Theme ── */}
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

            <button className="btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  )
}
