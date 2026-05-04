import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../../config/db.js'

export const registerUser = async (login, password, avatar = '🐣') => {
  const existing = await pool.query(
    'SELECT id FROM users WHERE login = $1',
    [login]
  )
  if (existing.rows.length > 0) {
    throw new Error('User already exists')
  }

  const password_hash = await bcrypt.hash(password, 10)
  const result = await pool.query(
    'INSERT INTO users (login, password_hash, avatar) VALUES ($1, $2, $3) RETURNING id, login, avatar',
    [login, password_hash, avatar]
  )

  return generateToken(result.rows[0])
}

export const loginUser = async (login, password) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE login = $1',
    [login]
  )
  const user = result.rows[0]

  if (!user) throw new Error('Invalid credentials')

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) throw new Error('Invalid credentials')

  return generateToken({ id: user.id, login: user.login, avatar: user.avatar })
}

export const getMe = async (userId) => {
  const result = await pool.query(
    'SELECT id, login, avatar FROM users WHERE id = $1',
    [userId]
  )
  if (!result.rows[0]) throw new Error('User not found')
  return result.rows[0]
}

export const updateUserAvatar = async (userId, avatar) => {
  const result = await pool.query(
    'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING id, login, avatar',
    [avatar, userId]
  )
  return generateToken(result.rows[0])
}

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, login: user.login, avatar: user.avatar },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  return { token, user: { id: user.id, login: user.login, avatar: user.avatar } }
}
