import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'


function AdminAuthors() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await axios.get('/admin/authors', {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setAuthors(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAuthors()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this author and all their blogs?')) return
    try {
      await axios.delete(`/admin/authors/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setAuthors(authors.filter(a => a._id !== id))
    } catch (err) {
      console.error(err)
    }
  }
  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>

  return (
    <div>
      <button onClick={() => navigate('/admin')} style={{ marginBottom: '20px' }}>← Back</button>
      <h2>Manage Authors ({authors.length})</h2>
      {authors.map(author => (
        <div key={author._id} style={{
          border: '1px solid #ddd', borderRadius: '8px',
          padding: '15px', marginBottom: '15px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0 }}>{author.name}</h4>
            <p style={{ color: '#888', margin: 0 }}>@{author.username} · {author.email}</p>
          </div>
          <button
            onClick={() => handleDelete(author._id)}
            style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff' }}
          >
            Delete
          </button>
        </div>
      ))}
      {authors.length === 0 && <p>No authors found.</p>}
    </div>
  ) 
}

export default AdminAuthors
