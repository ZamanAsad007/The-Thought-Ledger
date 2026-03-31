import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

function AdminCat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", color: "#000000" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/admin/categories", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/admin/categories/${editId}`, form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEditId(null);
      } else {
        await axios.post("/admin/categories", form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setForm({ name: "", color: "#000000" });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, color: cat.color });
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  return (
    <div>
      <button
        onClick={() => navigate("/admin")}
        style={{ marginBottom: "20px" }}
      >
        ← Back
      </button>
      <h2>Manage Categories</h2>

      {/* Add / Edit Form */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h3>{editId ? "Edit Category" : "Add New Category"}</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ flex: 1, padding: "10px" }}
          />
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            style={{ width: "50px", height: "40px", cursor: "pointer" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#333",
              color: "#fff",
            }}
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", color: "#000000" });
              }}
              style={{ padding: "10px 20px" }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      {categories.map((cat) => (
        <div
          key={cat._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: cat.color,
              }}
            />
            <h4 style={{ margin: 0 }}>{cat.name}</h4>
          </div>
          <div>
            <button
              onClick={() => handleEdit(cat)}
              style={{ padding: "8px 16px", marginRight: "10px" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(cat._id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e74c3c",
                color: "#fff",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {categories.length === 0 && <p>No categories yet.</p>}
    </div>
  );
}

export default AdminCat;
