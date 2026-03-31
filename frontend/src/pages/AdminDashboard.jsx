import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchStats = async()=>{
      try{
        const res = await axios.get('/admin/stats', {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setStats(res.data)
      }catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  },[])
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  if (loading) return <p className="page">Loading dashboard...</p>
  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Admin Panel</h2>
        <button onClick={handleLogout} style={{ padding: '10px 20px' }}>Logout</button>
      </div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Authors', value: stats?.totalAuthors },
          { label: 'Total Blogs', value: stats?.totalBlogs },
          { label: 'Total Categories', value: stats?.totalCategories }
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, border: '1px solid #ddd', borderRadius: '8px',
            padding: '20px', textAlign: 'center'
          }}>
            <h1 style={{ margin: 0 }}>{stat.value}</h1>
            <p style={{ color: '#888', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        {[
          { label: 'Manage Authors', path: '/admin/authors' },
          { label: 'Manage Blogs', path: '/admin/blogs' },
          { label: 'Manage Categories', path: '/admin/categories' }
        ].map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ flex: 1, padding: '15px', backgroundColor: '#333', color: '#fff', borderRadius: '8px' }}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
