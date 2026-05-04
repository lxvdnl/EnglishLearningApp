import { create } from 'zustand'

const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
})()

const useAuthStore = create((set) => ({
  user:  storedUser,
  token: localStorage.getItem('token'),

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  setAvatar: (avatar) => {
    set((state) => {
      const user = { ...state.user, avatar }
      localStorage.setItem('user', JSON.stringify(user))
      return { user }
    })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },
}))

export default useAuthStore
