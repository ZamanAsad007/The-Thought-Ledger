import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AuthorDashboard() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);
  const [chartData, setChartData] = useState([]);
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
        const [blogsRes, statsRes] = await Promise.all([
          axios.get("/blogs/my/blogs", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get("/users/my/stats", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setBlogs(blogsRes.data);
        setChartData(statsRes.data);
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

  const handleProfilePicFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const maxBytes = 3 * 1024 * 1024; // 3MB
    if (file.size > maxBytes) {
      setError("Image is too large (max 3MB)");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        profilePic: String(reader.result ?? ""),
      }));
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.put("/users/profile", form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      login({ ...user, ...res.data });
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBlogs(blogs.filter((b) => (b._id ?? b.id) !== blogId));
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) return <p>Loading your dashboard...</p>;
  return (
    <div className="page">
      <button
        onClick={() => navigate("/dashboard")}
        className="btn btnSecondary"
      >
        ← Back to Dashboard
      </button>

      <h2>My Profile</h2>
      {/* Edit Profile Form */}
      <div className="card stack">
        <h3>Edit Profile</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form className="form" onSubmit={handleUpdate}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Write a short bio..."
            value={form.bio}
            onChange={handleChange}
            rows={3}
          />
          <input
            name="profilePic"
            placeholder="Profile Picture URL"
            value={form.profilePic}
            onChange={handleChange}
          />

          <div className="stack">
            <input type="file" accept="image/*" onChange={handleProfilePicFileChange} />
            <p className="muted">Or upload an image (max 3MB).</p>
            {form.profilePic && (
              <img
                src={form.profilePic}
                alt="Profile preview"
                style={{ maxWidth: "220px", borderRadius: "var(--radius-sm)" }}
              />
            )}
          </div>

          <h4>Social Links</h4>
          <input
            name="facebook"
            placeholder="Facebook URL"
            value={form.socialLinks.facebook}
            onChange={handleSocialChange}
          />
          <input
            name="instagram"
            placeholder="Instagram URL"
            value={form.socialLinks.instagram}
            onChange={handleSocialChange}
          />
          <input
            name="twitter"
            placeholder="Twitter URL"
            value={form.socialLinks.twitter}
            onChange={handleSocialChange}
          />

          <button
            type="submit"
            disabled={updating}
            className="btn"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      {/* Pie Chart */}
      {chartData.length > 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h3>My Last 20 Blogs by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length === 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h3>My Last 20 Blogs by Category</h3>
          <p style={{ color: "#888" }}>
            Write some blogs to see your category breakdown!
          </p>
        </div>
      )}

      {/* My Blogs List */}
      <h3>My Blogs ({blogs.length})</h3>
      {blogs.length === 0 && <p>You haven't written any blogs yet.</p>}
      {blogs.map((blog) => (
        <div
          key={blog._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h4
            onClick={() => navigate(`/blogs/${blog._id}`)}
            style={{ cursor: "pointer", margin: "0 0 5px 0" }}
          >
            {blog.title}
          </h4>
          <p style={{ color: "#888", margin: "0 0 10px 0" }}>
            {new Date(blog.createdAt).toLocaleDateString()} ·{" "}
            {blog.category?.name}
          </p>
          <p>{blog.content.substring(0, 100)}...</p>
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => navigate(`/edit-blog/${blog._id}`)}
              style={{ padding: "6px 14px", marginRight: "10px" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              style={{
                padding: "6px 14px",
                backgroundColor: "#e74c3c",
                color: "#fff",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AuthorDashboard;
