import { toast } from "react-toastify";

export default function LinkTable({ links, onToggle, onDelete }) {
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  if (links.length === 0)
    return <p className="empty-text">No links yet. Create one above.</p>;

  return (
    <div className="link-table-wrap">
      <h2>Your Links</h2>
      <table className="link-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link._id}>
              <td>{link.title}</td>
              <td>
                <a href={link.shortUrl} target="_blank" rel="noreferrer">{link.shortUrl}</a>
                <button className="btn-copy" onClick={() => copy(link.shortUrl)}>Copy</button>
              </td>
              <td className="original-url">{link.url}</td>
              <td>{link.clicks}</td>
              <td>
                <span className={`badge ${link.isActive ? "active" : "inactive"}`}>
                  {link.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="actions">
                <button className="btn-toggle" onClick={() => onToggle(link._id)}>
                  {link.isActive ? "Deactivate" : "Activate"}
                </button>
                <button className="btn-delete" onClick={() => onDelete(link._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
