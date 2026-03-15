import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'

function BlogDetail() {
    const{id} =useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(()=>{
        const fetchBlog = async()=>{
            try{
                const res = await axios.get(`/blogs/${id}`)
                setBlog(res.data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }
        fetchBlog()
    },[id])
    if (loading) return <p className="page">Loading blog...</p>
  if (!blog) return <p className="page">Blog not found.</p>
  return (
    <div className="page">
      <div className="row">
        <button className="btn btnSecondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="stack">
        <div className="pageHeader">
          <h1 className="title">{blog.title}</h1>
          <p className="muted">
            By{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (blog.author?._id) navigate(`/authors/${blog.author._id}`)
              }}
            >
              {blog.author?.username ?? 'Unknown author'}
            </a>
            {' · '}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      {blog.coverImage && (
        <img src={blog.coverImage} alt={blog.title} /> 
      )}
        <div className="card">
          {blog.content}
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
