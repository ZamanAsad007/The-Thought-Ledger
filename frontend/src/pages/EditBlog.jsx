import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

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
    locationLabel: "",
    locationUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p></p>",
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });
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
          locationLabel: blog.location?.label ?? "",
          locationUrl: blog.location?.url ?? "",
        });
        editor?.commands?.setContent?.(blog.content || "<p></p>");
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, editor]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        location:
          form.locationLabel?.trim() || form.locationUrl?.trim()
            ? {
                label: form.locationLabel?.trim() || form.locationUrl?.trim(),
                url: form.locationUrl?.trim(),
              }
            : undefined,
        content: editor?.getHTML?.() ?? form.content,
      };

      delete payload.locationLabel;
      delete payload.locationUrl;

      await axios.put(`/blogs/${id}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate(`/my-profile`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInsertImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError("");

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      const maxBytes = 3 * 1024 * 1024;
      if (file.size > maxBytes) {
        setError("Image is too large (max 3MB)");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post("/uploads/image", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const url = res.data?.url;
      if (!url) {
        setError("Upload succeeded but no URL returned");
        return;
      }

      editor?.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="page">
      <div className="pageHeader toolbar">
        <div>
          <h2>Edit Blog</h2>
          <p className="muted">Update your post.</p>
        </div>
        <div className="actions">
          <button className="btn btnSecondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      <div className="card stack">
        {error && <p className="error">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
          />
          <select name="category" value={form.category} onChange={handleChange}>
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
          />

          <div className="row">
            <input
              type="text"
              name="locationLabel"
              placeholder="Location label (e.g., RC8G+26 Dhaka)"
              value={form.locationLabel}
              onChange={handleChange}
            />
            <input
              type="url"
              name="locationUrl"
              placeholder="Google Maps link (optional)"
              value={form.locationUrl}
              onChange={handleChange}
            />
          </div>

          <div className="stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <p className="muted">Content</p>
              <label className="btn btnSecondary" style={{ cursor: "pointer" }}>
                Insert image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInsertImage}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div className="richEditor">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button
              className="btn btnSecondary"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
