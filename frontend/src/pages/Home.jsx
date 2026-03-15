import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [search, setSearch] = useState('')
    const navigate = useNavigate();

    const handleSearch =(e)=>{
        e.preventDefault();
        if(search.trim()){
        navigate(`/authors?search=${encodeURIComponent(search.trim())}`)
        }
    }
  return ( 
    <div className="page">
      <div className="pageHeader">
        <h1 className="title">The Thought Ledger</h1>
        <p className="subtitle">Discover blogs and authors you'll love</p>
      </div>

      <div className="stack">
        <form className="row" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search authors or blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" type="submit">Search</button>
        </form>

        <div className="row">
          <button className="btn btnSecondary" onClick={() => navigate('/authors')}>
            View Authors
          </button>
          <button className="btn" onClick={() => navigate('/register')}>
            Sign Up as Author
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
