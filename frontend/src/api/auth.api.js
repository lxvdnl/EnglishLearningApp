const BASE = '/api/auth'

export const registerApi = async (login, password, avatar) => {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password, avatar }),
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

export const getMeApi = async (token) => {
  const res = await fetch(`${BASE}/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const updateAvatarApi = async (avatar, token) => {
  const res = await fetch(`${BASE}/avatar`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
