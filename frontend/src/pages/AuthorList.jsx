import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../api/axios'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function AuthorList() {
    const [authors, setAuthors] = useState([])
  const [statsByAuthorId, setStatsByAuthorId] = useState({})
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

              const statsPairs = await Promise.all(
                (res.data ?? []).map(async (author) => {
                  try {
                    const statsRes = await axios.get(`/users/authors/${author._id}/stats`)
                    return [author._id, statsRes.data ?? []]
                  } catch {
                    return [author._id, []]
                  }
                }),
              )
              setStatsByAuthorId(Object.fromEntries(statsPairs))
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
              <div className="authorCardTop">
                <div className="authorCardInfo">
                  {author.profilePic ? (
                    <img
                      className="avatarSm"
                      src={author.profilePic}
                      alt={author.username}
                    />
                  ) : (
                    <div className="avatarPlaceholder" aria-hidden="true" />
                  )}
                  <div className="authorCardText">
                    <h3>{author.username}</h3>
                    <p className="muted">{author.email}</p>
                    <p className="muted">{author.blogCount} blogs published</p>
                  </div>
                </div>

                <div className="authorCardChart">
                  {(statsByAuthorId[author._id] ?? []).length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statsByAuthorId[author._id]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={55}
                          label={false}
                        >
                          {(statsByAuthorId[author._id] ?? []).map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="muted">No chart yet.</p>
                  )}
                </div>
              </div>
            </div>
        ))
      }
      {filtered.length===0 && <p>No authors found.</p>}
    </div>
  )
}

export default AuthorList
