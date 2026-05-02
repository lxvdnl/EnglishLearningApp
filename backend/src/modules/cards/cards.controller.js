import { getSetCards, updateStatus } from './cards.service.js'

export const getCards = async (req, res) => {
  try {
    const data = await getSetCards(req.params.setId, req.user.id)
    res.json(data)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const updateCardStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['learned', 'learning'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    await updateStatus(req.params.cardId, status)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}