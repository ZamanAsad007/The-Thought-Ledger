import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'

function AdminBlogs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('/admin/blogs', {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setBlogs(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])
  
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return
    try {
      await axios.delete(`/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setBlogs(blogs.filter(b => b._id !== id))
    } catch (err) {
      console.error(err)
    }
  }
  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>

  return (
    <div>
      <button onClick={() => navigate('/admin')} style={{ marginBottom: '20px' }}>← Back</button>
      <h2>Manage Blogs ({blogs.length})</h2>
      {blogs.map(blog => (
        <div key={blog._id} style={{
          border: '1px solid #ddd', borderRadius: '8px',
          padding: '15px', marginBottom: '15px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0 }}>{blog.title}</h4>
            <p style={{ color: '#888', margin: 0 }}>
              By {blog.author?.name} · {blog.category?.name} · {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(blog._id)}
            style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff' }}
          >
            Delete
          </button>
        </div>
      ))}
      {blogs.length === 0 && <p>No blogs found.</p>}
    </div>
  )
}

export default AdminBlogs
