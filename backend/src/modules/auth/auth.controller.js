import { registerUser, loginUser, updateUserAvatar, getMe } from './auth.service.js'

export const register = async (req, res) => {
  try {
    const { login, password, avatar } = req.body
    if (!login || !password) {
      return res.status(400).json({ message: 'Login and password are required' })
    }
    const data = await registerUser(login, password, avatar)
    res.status(201).json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { login, password } = req.body
    if (!login || !password) {
      return res.status(400).json({ message: 'Login and password are required' })
    }
    const data = await loginUser(login, password)
    res.json(data)
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
}

export const me = async (req, res) => {
  try {
    const user = await getMe(req.user.id)
    res.json({ user })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body
    if (!avatar) {
      return res.status(400).json({ message: 'Avatar is required' })
    }
    const data = await updateUserAvatar(req.user.id, avatar)
    res.json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
