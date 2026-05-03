import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSetsApi } from '../api/sets.api'

export default function HomePage() {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = sets.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    getSetsApi()
      .then(setSets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-center">Loading...</div>
  if (error)   return <div className="page-center error">{error}</div>

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">My Sets</h1>
        <div className="home-header-right">
          <input
            className="search-input"
            placeholder="Search sets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => navigate('/sets/create')}>
            <span className="btn-text-desktop">+ New Set</span>
            <span className="btn-text-mobile">+</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{search ? 'No sets found' : 'You have no sets yet'}</p>
        </div>
      ) : (
        <div className="sets-list">
          {filtered.map((set) => {
            const total = parseInt(set.total_cards)
            const learned = parseInt(set.learned_cards)
            const percent = total > 0 ? Math.round((learned / total) * 100) : 0

            return (
              <div
                key={set.id}
                className="set-card"
                onClick={() => navigate(`/sets/${set.id}`)}
              >
                <div className="set-card-top">
                  <h3 className="set-card-title">{set.name}</h3>
                  <span className="set-card-count">{total} cards</span>
                </div>

                {set.description && (
                  <p className="set-card-desc">{set.description}</p>
                )}

                {total > 0 && (
                  <div className="set-card-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="progress-label">{percent}% learned</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}