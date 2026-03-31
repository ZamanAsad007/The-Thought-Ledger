import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../api/axios'

function AuthorList() {
    const [authors, setAuthors] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(()=>{
        const params = new URLSearchParams(location.search);
        const q = params.get('search')
        if(q) setSearch(q)
        
        const fetchAuthors = async()=>{
            try{
              const res = await axios.get('/users/authors')  
              setAuthors(res.data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }    
        fetchAuthors()
    },[])
    
    const query = search.toLowerCase()
    const filtered = authors.filter((author) => {
      const username = (author.username ?? '').toLowerCase()
      const email = (author.email ?? '').toLowerCase()
      return username.includes(query) || email.includes(query)
    })
    if(loading) return <p>Loading Authors...</p>
  return (
    <div className="page">
      <div className="pageHeader">
        <div className="toolbar">
          <button
            type="button"
            className="btn btnSecondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        <h2>All Authors</h2>
      </div>

      <div className="row">
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {
        filtered.map(author=>(
            <div
              className="card cardInteractive"
              key={author._id}
              onClick={() => navigate(`/authors/${author._id}`)}
            >
              <h3>{author.username}</h3>
              <p className="muted">{author.email}</p>
              <p className="muted">{author.blogCount} blogs published</p>
            </div>
        ))
      }
      {filtered.length===0 && <p>No authors found.</p>}
    </div>
  )
}

export default AuthorList
