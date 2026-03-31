import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import DOMPurify from 'dompurify'

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

  const raw = blog.content ?? ''
  const normalized = raw.includes('<')
    ? raw
    : `<p>${raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>')}</p>`
  const safeHtml = DOMPurify.sanitize(normalized)

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

          {blog.location?.label && blog.location?.url && (
            <p className="muted">
              Location:{' '}
              <a href={blog.location.url} target="_blank" rel="noreferrer">
                {blog.location.label}
              </a>
            </p>
          )}
        </div>
      {blog.coverImage && (
        <img className="coverImage" src={blog.coverImage} alt={blog.title} /> 
      )}
        <div className="card prose" dangerouslySetInnerHTML={{ __html: safeHtml }} />
      </div>
    </div>
  )
}

export default BlogDetail
