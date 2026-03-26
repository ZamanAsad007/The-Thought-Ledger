import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

function Dashboard() {
  const { user, logout } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBlogs((res.data ?? []).slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  if (loading) return <p>Loading dashboard...</p>;
  return (
    <div className="page">
      <div className="pageHeader toolbar">
        <div>
          <h2>Dashboard</h2>
          <p className="muted">
            Welcome, {user?.name ?? user?.username ?? "Author"}.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => navigate("/add-blog")}>
            + Add Blog
          </button>
          <button onClick={() => navigate("/my-profile")}>My Profile</button>
          <button className="btn btnSecondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="stack">
        <h3>Recent Blogs</h3>
        {blogs.length === 0 && <p className="muted">No blogs yet.</p>}
        {blogs.map((blog) => {
          const blogId = blog?._id ?? blog?.id;
          return (
            <div
              className="card cardInteractive"
              key={blogId}
              onClick={() => blogId && navigate(`/blogs/${blogId}`)}
            >
              <h4>{blog?.title}</h4>
              <p className="muted">
                By{" "}
                {blog?.author?.name ??
                  blog?.author?.username ??
                  "Unknown author"}{" "}
                {" · "}
                {blog?.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString()
                  : ""}
              </p>
              <p className="muted">
                {(blog?.content ?? "").substring(0, 120)}...
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
