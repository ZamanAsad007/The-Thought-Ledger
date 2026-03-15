import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function AuthorProfilePage() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorRes, blogsRes] = await Promise.all([
          axios.get(`/users/authors/${id}`),
          axios.get(`/blogs/author/${id}`),
        ]);
        setAuthor(authorRes.data);
        setBlogs(blogsRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (loading) return <p>Loading Profile...</p>;
  if (!author) return <p>Author not found</p>;
  return (
    <div className="page">
      <div className="card">
        {author.profilePic && (
          <img src={author.profilePic} alt={author.username} />
        )}
        <h2>{author.username}</h2>
        <p className="muted">@{author.username}</p>
        <p className="muted">{author.bio || "no bio yet."} </p>

        <div>
          {author.socialLinks?.facebook && (
            <a
              href={author.socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          )}
          {author.socialLinks?.instagram && (
            <a
              href={author.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          )}
          {author.socialLinks?.twitter && (
            <a
              href={author.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
          )}
        </div>
      </div>
      <h3>Blogs by {author.username}</h3>
      {blogs.length === 0 && <p>No blogs published yet.</p>}
      {blogs.map((blog) => (
        <div className="card cardInteractive" key={blog._id} onClick={() => navigate(`/blogs/${blog._id}`)}>
          <h4>{blog.title}</h4>
          <p className="muted">{new Date(blog.createdAt).toLocaleDateString()}</p>
          <p className="muted">{blog.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default AuthorProfilePage;
