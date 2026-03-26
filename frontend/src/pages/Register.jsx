import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'

function Register() {
    const [form, setForm]= useState({
        name:'',
        username:'',
        email:'',
        password:''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {login} = useAuth()
    const navigate = useNavigate()
    
    const handleSubmit= async(e)=>{
        e.preventDefault()
        setLoading(true)
        setError('')
        try{
            const res= await axios.post('/auth/register', form)
            login(res.data)
            navigate('/dashboard')
        }catch(err){
            setError(err.response?.data?.message || 'Registration failed')
        }finally{
            setLoading(false)
        }
    }

    const handleChange =(e)=>{
        setForm({...form, [e.target.name]: e.target.value})
    }

    
  return (
    <div className="page">
      <div className="pageHeader">
        <h2>Sign Up as Author</h2>
        <p className="muted">Create your author account to publish blogs.</p>
      </div>

      <div className="card authCard stack">
        {error && <p className="error">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            autoComplete="name"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            autoComplete="username"
            required
          />
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
            autoComplete="new-password"
            required
          />

          <div className="actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Registering…' : 'Register'}
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
          Already an author?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/login')
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
