import { useState } from "react";

export default function CreateLinkForm({ onSubmit }) {
  const [form, setForm] = useState({ title: "", url: "", startTime: "", endTime: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      title: form.title,
      url: form.url,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
    });
    setForm({ title: "", url: "", startTime: "", endTime: "" });
    setLoading(false);
  };

  return (
    <div className="create-form-card">
      <h2>Create Short Link</h2>
      <form className="create-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="url" placeholder="Original URL (https://...)" value={form.url} onChange={handleChange} required />
        <div className="time-row">
          <label>
            Start Time (optional)
            <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} />
          </label>
          <label>
            End Time (optional)
            <input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} />
          </label>
        </div>
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Shorten URL"}</button>
      </form>
    </div>
  );
}
