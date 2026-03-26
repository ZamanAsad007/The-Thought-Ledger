import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

function AuthorDashboard() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    profilePic: user?.profilePic || "",
    socialLinks: {
      facebook: user?.socialLinks?.facebook || "",
      instagram: user?.socialLinks?.instagram || "",
      twitter: user?.socialLinks?.twitter || "",
    },
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs/my/blogs", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setForm({
      ...form,
      socialLinks: { ...form.socialLinks, [e.target.name]: e.target.value },
    });
  };
  const handleUpdate= async(e)=>{
    e.preventDefault()
    setUpdating(true)
    setError('')
    setSuccess('')
    try{
        const res = await axios.put('/users/profile', form,{
            headers:{Authorization:`Bearer ${user.token}`}
        })
        login({...user, ...res.data})
        setSuccess('Profile updated successfully')
    }catch(err){
        setError(err.response?.data?.message || 'Failed to update profile')
    }finally{
        setUpdating(false)
    }
  }

  const handleDelete = async(blogId)=>{
    if(!window.confirm('Are you sure you want to delete this blog?')) return
    try{
        await axios.delete(`/blogs/${blogId}`,{
            headers:{Authorization:`Bearer ${user.token}`}
        })
        setBlogs(blogs.filter(b=> (b._id ?? b.id) !== blogId))
    }catch(err){
        console.err(err)
    }
  }
  if(loading) return <p>Loading your dashboard...</p>;
  return <div>
     <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>← Back to Dashboard</button>

      <h2>My Profile</h2>
       {/* Edit Profile Form */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h3>Edit Profile</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleUpdate}>
          <input
            name='name'
            placeholder='Full Name'
            value={form.name}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <textarea
            name='bio'
            placeholder='Write a short bio...'
            value={form.bio}
            onChange={handleChange}
            rows={3}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <input
            name='profilePic'
            placeholder='Profile Picture URL'
            value={form.profilePic}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <h4>Social Links</h4>
          <input
            name='facebook'
            placeholder='Facebook URL'
            value={form.socialLinks.facebook}
            onChange={handleSocialChange}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <input
            name='instagram'
            placeholder='Instagram URL'
            value={form.socialLinks.instagram}
            onChange={handleSocialChange}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <input
            name='twitter'
            placeholder='Twitter URL'
            value={form.socialLinks.twitter}
            onChange={handleSocialChange}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
          />

          <button
            type='submit'
            disabled={updating}
            style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff' }}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* My Blogs List */}
      <h3>My Blogs ({blogs.length})</h3>
      {blogs.length === 0 && <p>You haven't written any blogs yet.</p>}
      {blogs.map(blog => (
        <div
          key={blog._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
          }}
        >
          <h4
            onClick={() => navigate(`/blogs/${blog._id}`)}
            style={{ cursor: 'pointer', margin: '0 0 5px 0' }}
          >
            {blog.title}
          </h4>
          <p style={{ color: '#888', margin: '0 0 10px 0' }}>
            {new Date(blog.createdAt).toLocaleDateString()} · {blog.category?.name}
          </p>
          <p>{blog.content.substring(0, 100)}...</p>
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={() => navigate(`/edit-blog/${blog._id}`)}
              style={{ padding: '6px 14px', marginRight: '10px' }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              style={{ padding: '6px 14px', backgroundColor: '#e74c3c', color: '#fff' }}
            >
              Delete
            </button>
          </div>
        </div>
        ))}
  </div>;
}

export default AuthorDashboard;
