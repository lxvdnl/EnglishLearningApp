import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCardsApi, updateCardStatusApi } from '../api/cards.api'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'
import { updateAvatarApi } from '../api/auth.api'
import { AVATARS } from '../utils/emojis'

const THRESHOLD = 60

const THEMES = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'forest',   label: 'Forest'   },
  { id: 'lavender', label: 'Lavender' },
  { id: 'sunrise',  label: 'Sunrise'  },
]

export default function StudyPage() {
  const { setId } = useParams()
  const navigate  = useNavigate()

  const user      = useAuthStore((s) => s.user)
  const token     = useAuthStore((s) => s.token)
  const setAvatar = useAuthStore((s) => s.setAvatar)
  const logout    = useAuthStore((s) => s.logout)
  const { theme, setTheme } = useThemeStore()

  const [set,       setSet]       = useState(null)
  const [cards,     setCards]     = useState([])
  const [index,     setIndex]     = useState(0)
  const [flipped,   setFlipped]   = useState(false)
  const [learned,   setLearned]   = useState(0)
  const [learning,  setLearning]  = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [exiting,   setExiting]   = useState(null)
  const [dragX,     setDragX]     = useState(0)

  // Settings dropdown
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [themeOpen,    setThemeOpen]    = useState(false)
  const [emojiOpen,    setEmojiOpen]    = useState(false)
  const settingsRef = useRef(null)

  const drag      = useRef({ active: false, x: 0, startX: 0 })
  const clickData = useRef({ x: 0, startTime: 0 })
  const cardRef   = useRef()
  const wrapperRef = useRef()

  const avatar = user?.avatar ?? '🐣'

  useEffect(() => {
    getCardsApi(setId)
      .then(({ set, cards }) => { setSet(set); setCards(cards) })
      .finally(() => setLoading(false))
  }, [setId])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      document.documentElement.style.overflow = ''
    }
  }, [])

  // Close settings on outside click
  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false); setThemeOpen(false); setEmojiOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleAvatarSelect = async (e) => {
    setAvatar(e)
    setEmojiOpen(false)
    try {
      const data = await updateAvatarApi(e, token)
      useAuthStore.getState().setAuth(data.user, data.token)
    } catch { /* silent */ }
  }

  const handleLogout = () => { logout(); navigate('/auth') }

  const current      = cards[index]
  const total        = cards.length
  const swipeProgress = Math.min(Math.abs(dragX) / THRESHOLD, 1)
  const rotate       = dragX * 0.08
  const opacity      = 1 - swipeProgress * 0.5
  const bgColor      = dragX > 0
    ? `rgba(80, 200, 100, ${swipeProgress * 0.35})`
    : dragX < 0
    ? `rgba(255, 160, 60, ${swipeProgress * 0.35})`
    : 'transparent'

  const onPointerDown = (e) => {
    cardRef.current?.setPointerCapture(e.pointerId)
    drag.current      = { active: true, x: 0, startX: e.clientX }
    clickData.current = { x: 0, startTime: Date.now() }
  }

  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const x = e.clientX - drag.current.startX
    drag.current.x      = x
    clickData.current.x = x
    setDragX(x)
  }

  const onPointerUp = () => {
    if (!drag.current.active) return
    const x = drag.current.x
    drag.current = { active: false, x: 0, startX: 0 }

    if (Math.abs(x) < THRESHOLD) { setDragX(0); return }

    const status = x > 0 ? 'learned' : 'learning'
    updateCardStatusApi(current.id, status)
    if (status === 'learned') setLearned((n) => n + 1)
    else                      setLearning((n) => n + 1)

    setExiting(x > 0 ? 'right' : 'left')
    setDragX(0)

    setTimeout(() => {
      setExiting(null)
      setFlipped(false)
      setIndex((i) => (i >= total - 1 ? total : i + 1))
    }, 380)
  }

  if (loading)       return <div className="page-center">Loading...</div>
  if (!cards.length) return <div className="page-center">No cards in this set</div>

  if (index >= total) {
    return (
      <div className="study-done">
        <h2>Done! 🎉</h2>
        <div className="study-done-stats">
          <span className="stat-learned">{learned} learned</span>
          <span className="stat-learning">{learning} learning</span>
        </div>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    )
  }

  return (
    <div className="study-page" style={{ background: bgColor }}>
      {/* ── Back button ── */}
      <button className="study-back-absolute" onClick={() => navigate('/')}>← Back</button>

      {/* ── Avatar / Settings button ── */}
      <div className="study-settings-wrapper" ref={settingsRef}>
        <button
          className="study-avatar-btn"
          onClick={() => { setSettingsOpen((v) => !v); setThemeOpen(false); setEmojiOpen(false) }}
          aria-label="Settings"
        >
          {avatar}
        </button>

        {settingsOpen && (
          <div className="dropdown study-dropdown">
            {/* Emoji */}
            <button
              className="dropdown-menu-item"
              onClick={() => setEmojiOpen((v) => !v)}
            >
              <span className="dropdown-menu-item-label">Emoji</span>
              <span className="dropdown-menu-item-right">
                <span className="dropdown-menu-item-value">{avatar}</span>
                <svg className={`dropdown-chevron ${emojiOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
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

            {/* Theme */}
            <button
              className="dropdown-menu-item"
              onClick={() => setThemeOpen((v) => !v)}
            >
              <span className="dropdown-menu-item-label">Theme</span>
              <span className="dropdown-menu-item-right">
                <span className="dropdown-menu-item-value">
                  {THEMES.find((t) => t.id === theme)?.label ?? theme}
                </span>
                <svg className={`dropdown-chevron ${themeOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
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

      {/* ── Main content ── */}
      <div className="study-content">
        <div className="study-header">
          <h2 className="study-set-name">{set.name}</h2>
          {set.description && <p className="study-set-desc">{set.description}</p>}
          <div className="study-progress">
            <span className="stat-learned">{learned}</span>
            <span className="stat-sep"> / </span>
            <span className="stat-learning">{learning}</span>
            <span className="stat-sep"> / {total}</span>
          </div>
        </div>

        <div className="study-card-wrapper" ref={wrapperRef}>
          <div
            key={index}
            ref={cardRef}
            className={`study-card ${flipped ? 'flipped' : ''}`}
            style={{
              transform: exiting
                ? `translateX(${exiting === 'right' ? 500 : -500}px) rotate(${exiting === 'right' ? 25 : -25}deg)`
                : `translateX(${dragX}px) rotate(${rotate}deg)`,
              opacity:    exiting ? 0 : opacity,
              cursor:     drag.current.active ? 'grabbing' : 'grab',
              transition: exiting
                ? 'transform 0.35s ease, opacity 0.35s ease'
                : drag.current.active
                ? 'none'
                : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s',
            }}
            onClick={() => {
              const { x, startTime } = clickData.current
              if (Math.abs(x) < 8 && Date.now() - startTime < 300) setFlipped((f) => !f)
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="study-card-inner">
              <div className="study-card-front"><span>{current.source_word}</span></div>
              <div className="study-card-back">
                <span>{current.translated_word}</span>
                {current.description && <p className="study-card-hint">{current.description}</p>}
              </div>
            </div>
          </div>

          <div className="swipe-buttons">
            <button
              className="swipe-btn swipe-btn-learning"
              onClick={() => {
                updateCardStatusApi(current.id, 'learning')
                setLearning((n) => n + 1)
                setExiting('left')
                setTimeout(() => { setExiting(null); setFlipped(false); setIndex((i) => (i >= total - 1 ? total : i + 1)) }, 380)
              }}
            >
              Still learning
            </button>
            <button
              className="swipe-btn swipe-btn-learned"
              onClick={() => {
                updateCardStatusApi(current.id, 'learned')
                setLearned((n) => n + 1)
                setExiting('right')
                setTimeout(() => { setExiting(null); setFlipped(false); setIndex((i) => (i >= total - 1 ? total : i + 1)) }, 380)
              }}
            >
              Know
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
