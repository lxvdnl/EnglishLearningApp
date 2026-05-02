import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import CreateSetPage from './pages/CreateSetPage'
import StudyPage from './pages/StudyPage'
import Layout from './components/layout/Layout'
import useAuthStore from './store/authStore'

function App() {
  const token = useAuthStore((s) => s.token)

  return (
    <Routes>
      <Route path="/auth" element={!token ? <AuthPage /> : <Navigate to="/" />} />
      <Route path="/" element={token ? <Layout><HomePage /></Layout> : <Navigate to="/auth" />} />
      <Route path="/sets/create" element={token ? <Layout><CreateSetPage /></Layout> : <Navigate to="/auth" />} />
      <Route path="/sets/:setId" element={token ? <StudyPage /> : <Navigate to="/auth" />} />
    </Routes>
  )
}

export default App