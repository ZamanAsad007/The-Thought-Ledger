import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/Home'
import AuthorListPage from './pages/AuthorList'
import AuthorProfilePage from './pages/AuthorProfilePage'
import BlogDetailPage from './pages/BlogDetail'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/authors' element={<AuthorListPage />} />
          <Route path='/authors/:id' element={<AuthorProfilePage />} />
          <Route path='/blogs/:id' element={<BlogDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
