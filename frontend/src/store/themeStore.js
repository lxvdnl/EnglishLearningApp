import { create } from 'zustand'

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'midnight',

  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  },
}))

export default useThemeStore