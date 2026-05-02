const BASE = '/api/sets'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const getSetsApi = async () => {
  const res = await fetch(BASE, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const createSetApi = async (name, description, cards) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, description, cards }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}