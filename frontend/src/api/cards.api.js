const BASE = '/api/cards'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const getCardsApi = async (setId) => {
  const res = await fetch(`${BASE}/${setId}`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export const updateCardStatusApi = async (cardId, status) => {
  await fetch(`${BASE}/${cardId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
}