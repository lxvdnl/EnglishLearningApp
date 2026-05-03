import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSetApi } from '../api/sets.api'
import { parseCardsText } from '../utils/parseCards'

const emptyCard = () => ({ source_word: '', translated_word: '', description: '' })

export default function CreateSetPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [importErrors, setImportErrors] = useState([])
  const fileRef = useRef()

  const updateCard = (i, field, value) => {
    setCards((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c))
  }

  const addCard = () => setCards((prev) => [emptyCard(), ...prev])

  const removeCard = (i) => {
    setCards((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImportText(ev.target.result)
    reader.readAsText(file)
  }

  const handleImportConfirm = () => {
    const { cards: parsed, errors } = parseCardsText(importText)
    if (errors.length) {
      setImportErrors(errors)
      return
    }
    setCards((prev) => {
      const filtered = prev.filter((c) => c.source_word || c.translated_word)
      return [...filtered, ...parsed]
    })
    setImportText('')
    setImportErrors([])
    setImportOpen(false)
  }

  const handleCreate = async () => {
    setError('')
    const validCards = cards.filter((c) => c.source_word.trim() && c.translated_word.trim())

    if (!name.trim()) return setError('Set name is required')
    if (!validCards.length) return setError('Add at least one card')

    setLoading(true)
    try {
      const { id } = await createSetApi(name.trim(), description.trim(), validCards)
      navigate(`/sets/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-page">
      <button className="study-back" onClick={() => navigate('/')}>← Back</button>

      {/* ── Set info ── */}
      <div className="create-section">
        <div className="create-section-header">
          <h1>New Set</h1>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create Set'}
          </button>
        </div>
        <input
          placeholder="Set name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error && <p className="form-error">{error}</p>}
      </div>

      {/* ── Cards ── */}
      <div className="create-section">
        <div className="cards-header">
          <span>Cards {cards.length}</span>
          <div className="cards-header-btns">
            <button className="btn-add-card" onClick={addCard}>
              + Add card
            </button>
            <button className="btn-secondary" onClick={() => setImportOpen(true)}>
              ↑ Import
            </button>
          </div>
        </div>

        {cards.length > 0 && (
          <div className="cards-list">
            {cards.map((card, i) => (
              <div key={i} className="card-row">
                <div className="card-row-fields">
                    <input
                      placeholder="Word *"
                      value={card.source_word}
                      onChange={(e) => updateCard(i, 'source_word', e.target.value)}
                    />
                    <input
                      placeholder="Translation *"
                      value={card.translated_word}
                      onChange={(e) => updateCard(i, 'translated_word', e.target.value)}
                    />
                    <input
                      placeholder="Description (optional)"
                      value={card.description}
                      onChange={(e) => updateCard(i, 'description', e.target.value)}
                    />
                </div>
                <button className="btn-remove" onClick={() => removeCard(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Import Modal ── */}
      {importOpen && (
        <div className="modal-overlay" onClick={() => setImportOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Import Cards</h3>
              <button className="btn-ghost" onClick={() => setImportOpen(false)}>✕</button>
            </div>

            <p className="modal-hint">
              Each line: <code>word, translation, description</code><br />
              Separators: <code>Tab</code>, <code>,</code> or <code>;</code>
            </p>

            <textarea
              className="import-textarea"
              placeholder={`apple, яблоко\ncat\tкот\tживотное\ndog; собака`}
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value)
                setImportErrors([])
              }}
            />

            <div className="modal-file">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button className="btn-secondary" onClick={() => fileRef.current.click()}>
                Upload CSV / TXT
              </button>
              {importText && <span className="modal-file-ready">File loaded ✓</span>}
            </div>

            {importErrors.length > 0 && (
              <div className="import-errors">
                <p>Fix these lines:</p>
                {importErrors.map((e, i) => <p key={i}>{e}</p>)}
              </div>
            )}

            <button onClick={handleImportConfirm} disabled={!importText.trim()}>
              Add to set
            </button>
          </div>
        </div>
      )}
    </div>
  )
}