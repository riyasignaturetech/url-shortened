import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CreateLinkForm from "../components/CreateLinkForm";
import LinkTable from "../components/LinkTable";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const { data } = await api.get("/api/links");
      setLinks(data);
    } catch {
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleCreate = async (formData) => {
    try {
      const { data } = await api.post("/api/links", formData);
      setLinks((prev) => [data, ...prev]);
      toast.success("Short link created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create link");
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.patch(`/api/links/${id}/toggle`);
      setLinks((prev) => prev.map((l) => l._id === id ? { ...l, isActive: data.isActive } : l));
    } catch {
      toast.error("Failed to update link");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await api.delete(`/api/links/${id}`);
      setLinks((prev) => prev.filter((l) => l._id !== id));
      toast.success("Link deleted");
    } catch {
      toast.error("Failed to delete link");
    }
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <h1>URL Shortener</h1>
        <div className="dash-user">
          <span>Hi, {user?.username}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <CreateLinkForm onSubmit={handleCreate} />

      {loading ? (
        <p className="loading-text">Loading links...</p>
      ) : (
        <LinkTable links={links} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}
