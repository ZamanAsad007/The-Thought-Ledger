import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

function AddBlog() {
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
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/users/categories");
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const maxBytes = 3 * 1024 * 1024; // 3MB
    if (file.size > maxBytes) {
      setError('Image is too large (max 3MB)');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, coverImage: String(reader.result ?? '') }));
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/blogs", form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="pageHeader toolbar">
        <div>
          <h2>Write a New Blog</h2>
          <p className="muted">Share your thoughts with readers.</p>
        </div>
        <div className="actions">
          <button className="btn btnSecondary" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
        </div>
      </div>

      <div className="card stack">
        {error && <p className="error">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            onChange={handleChange}
            value={form.title}
            required
          />
          <select
            name="category"
            onChange={handleChange}
            value={form.category}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="url"
            name="coverImage"
            placeholder="Cover Image URL (optional)"
            onChange={handleChange}
            value={form.coverImage}
          />
          <div className="stack">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverFileChange}
            />
            <p className="muted">
              Or upload an image (max 3MB).
            </p>
            {form.coverImage?.startsWith('data:image/') && (
              <img
                src={form.coverImage}
                alt="Cover preview"
                style={{ maxWidth: '100%', borderRadius: 'var(--radius-sm)' }}
              />
            )}
          </div>
          <textarea
            name="content"
            placeholder="Write your blog content here..."
            onChange={handleChange}
            value={form.content}
            rows={12}
            required
          />
          <div className="actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Publishing…" : "Publish Blog"}
            </button>
            <button
              className="btn btnSecondary"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBlog;
