import { registerUser, loginUser } from './auth.service.js'

export const register = async (req, res) => {
  try {
    const { login, password } = req.body
    if (!login || !password) {
      return res.status(400).json({ message: 'Login and password are required' })
    }
    const data = await registerUser(login, password)
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