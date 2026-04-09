import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/Home";
import AuthorListPage from "./pages/AuthorList";
import AuthorProfilePage from "./pages/AuthorProfilePage";
import BlogDetailPage from "./pages/BlogDetail";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import AddBlogPage from "./pages/AddBlog";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AuthorDashboardProfile from "./pages/AuthorDashboard";
import EditBlogPage from "./pages/EditBlog";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminAuthorsPage from "./pages/AdminAuthors";
import AdminBlogsPage from "./pages/AdminBlogs";
import AdminCategoriesPage from "./pages/AdminCat";
import AdminRoute from "./components/AdminRoute";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="appLayout">
          <main className="layoutMiddle layoutContent">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/authors" element={<AuthorListPage />} />
              <Route path="/authors/:id" element={<AuthorProfilePage />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-blog"
                element={
                  <ProtectedRoute>
                    <AddBlogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute>
                    <AuthorDashboardProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-blog/:id"
                element={
                  <ProtectedRoute>
                    <EditBlogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/authors"
                element={
                  <AdminRoute>
                    <AdminAuthorsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/blogs"
                element={
                  <AdminRoute>
                    <AdminBlogsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <AdminCategoriesPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
