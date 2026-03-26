import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

function EditBlog() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    coverImage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          axios.get(`/blogs/${id}`),
          axios.get("/users/categories"),
        ]);
        const blog = blogRes.data;
        setForm({
          title: blog.title,
          content: blog.content,
          category: blog.category?._id ?? "",
          coverImage: blog.coverImage ?? "",
        });
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.put(`/blogs/${id}`, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate(`/my-profile`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>
      <h2>Edit Blog</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          value={form.coverImage}
          onChange={handleChange}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <textarea
          name="content"
          placeholder="Blog content..."
          value={form.content}
          onChange={handleChange}
          rows={12}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
