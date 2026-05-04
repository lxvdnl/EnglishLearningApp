import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import CreateSetPage from './pages/CreateSetPage'
import StudyPage from './pages/StudyPage'
import Layout from './components/layout/Layout'
import useAuthStore from './store/authStore'
import { getMeApi } from './api/auth.api'

function App() {
  const token   = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout  = useAuthStore((s) => s.logout)

  // Sync fresh user data from server on every app load
  useEffect(() => {
    if (!token) return
    getMeApi(token)
      .then(({ user }) => setAuth(user, token))
      .catch(() => logout())          // token expired / invalid
  }, [])                              // run once on mount

  return (
    <Routes>
      <Route path="/auth"        element={!token ? <AuthPage />                              : <Navigate to="/" />} />
      <Route path="/"            element={ token  ? <Layout><HomePage /></Layout>             : <Navigate to="/auth" />} />
      <Route path="/sets/create" element={ token  ? <Layout><CreateSetPage /></Layout>        : <Navigate to="/auth" />} />
      <Route path="/sets/:setId" element={ token  ? <StudyPage />                             : <Navigate to="/auth" />} />
    </Routes>
  )
}

export default App
