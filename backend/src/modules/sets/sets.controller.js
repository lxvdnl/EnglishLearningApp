import { getUserSets, createUserSet } from './sets.service.js'

export const getSets = async (req, res) => {
  try {
    const sets = await getUserSets(req.user.id)
    res.json(sets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createSet = async (req, res) => {
  try {
    const { name, description, cards } = req.body

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' })
    }
    if (!cards?.length) {
      return res.status(400).json({ message: 'Add at least one card' })
    }

    const setId = await createUserSet(req.user.id, name.trim(), description, cards)
    res.status(201).json({ id: setId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}