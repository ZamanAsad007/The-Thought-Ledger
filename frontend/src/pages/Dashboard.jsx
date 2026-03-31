import { useEffect, useState } from "react";
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

function Dashboard() {
  const { user, login, logout } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!user?.token) return;

        const headers = { Authorization: `Bearer ${user.token}` };
        const [meRes, blogsRes, statsRes] = await Promise.all([
          axios.get('/auth/me', { headers }),
          axios.get('/blogs', { headers }),
          axios.get('/users/my/stats', { headers }),
        ]);

        // Ensure dashboard always has latest profile fields after login.
        login(meRes.data);

        setBlogs((blogsRes.data ?? []).slice(0, 10));
        setChartData(statsRes.data ?? []);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [user?.token]);
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
            Welcome, {user?.username ?? "Author"}.
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

      <div className="row">
        <div className="card" style={{ flex: "1 1 320px" }}>
          <div className="authorHeader">
            {user?.profilePic ? (
              <img className="avatarSm" src={user.profilePic} alt={user.username} />
            ) : (
              <div className="avatarPlaceholder" aria-hidden="true" />
            )}
            <div>
              <h3 style={{ margin: 0 }}>{user?.username}</h3>
              <p className="muted" style={{ marginTop: 6 }}>
                {user?.bio || "No bio yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: "2 1 420px" }}>
          <h3 style={{ marginTop: 0 }}>My Last 20 Blogs by Category</h3>
          {chartData.length > 0 ? (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
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
          ) : (
            <p className="muted">Write some blogs to see your category breakdown.</p>
          )}
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
