import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../../config/db.js'

export const registerUser = async (login, password) => {
  const existing = await pool.query(
    'SELECT id FROM users WHERE login = $1',
    [login]
  )
  if (existing.rows.length > 0) {
    throw new Error('User already exists')
  }

  const password_hash = await bcrypt.hash(password, 10)
  const result = await pool.query(
    'INSERT INTO users (login, password_hash) VALUES ($1, $2) RETURNING id, login',
    [login, password_hash]
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

  return generateToken({ id: user.id, login: user.login })
}

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, login: user.login },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  return { token, user: { id: user.id, login: user.login } }
}