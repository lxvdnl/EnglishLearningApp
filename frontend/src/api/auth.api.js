const BASE = '/api/auth'

export const registerApi = async (login, password) => {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const loginApi = async (login, password) => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}