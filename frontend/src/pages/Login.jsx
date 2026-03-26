import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'
function Login() {
    const[form, setForm]= useState({
        email:'', password:''
      })
      const [error, setError] = useState('')
      const [loading, setLoading] = useState(false)
      const{login} = useAuth()
      const navigate = useNavigate()

      const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value})
      }

      const handleSubmit = async(e)=>{
        e.preventDefault()
        setLoading(true)
        setError('')
        try{
          const res = await axios.post('/auth/login', form)
          login(res.data)
          navigate('/dashboard')
        }catch(err){
          setError(err.response?.data?.message || 'Login failed')
        }finally{
          setLoading(false)
        }
      }
  return (
    <div className="page">
      <div className="pageHeader">
        <h2>Author Login</h2>
        <p className="muted">Sign in to manage your blogs.</p>
      </div>

      <div className="card authCard stack">
        {error && <p className="error">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <div className="actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
            <button
              className="btn btnSecondary"
              type="button"
              onClick={() => navigate('/')}
            >
              Back
            </button>
          </div>
        </form>

        <p className="muted">
          New author?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/register')
            }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
