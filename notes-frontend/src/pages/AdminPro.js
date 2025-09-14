import React, { useState, useEffect } from "react";
import api from "../api";
import styles from "./AdminPro.module.css";

function AdminPro({ setToken }) {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, []);

  const addNote = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const res = await api.post("/notes", {
        title: newTitle,
        content: newContent,
      });
      setNotes([res.data, ...notes]);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const inviteUser = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    try {
      const res = await api.post(`/tenants/${user.tenant}/invite`, {
        email: inviteEmail,
      });
      setInviteMessage(`User invited: ${res.data.email}`);
      setInviteEmail("");
    } catch (err) {
      setInviteMessage(err.response?.data?.error || "Invite failed");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles["header-left"]}>
          <h1>Admin Dashboard</h1>
        </div>
        <div className={styles["user-info"]}>
          <div className={styles["user-email"]}>{user.email}</div>
          <div className={styles["user-details"]}>
            <span className={styles["tenant-badge"]}>{user.tenant}</span>
            <span className={styles["role-badge"]}>Admin</span>
            <span className={styles["pro-badge"]}>Pro</span>
          </div>
          <button
            className={styles.btn + " " + styles["btn-secondary"]}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className={styles["main-content"]}>
        <div className={styles["left-column"]}>
          <section className={styles.section}>
            <h2 className={styles["section-title"]}>Create New Note</h2>
            <div className={styles["pro-status"]}>
              <h3>✨ Pro Plan Active</h3>
              <p>Unlimited notes, advanced features, and priority support</p>
            </div>
            <form onSubmit={addNote}>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Title</label>
                <input
                  type="text"
                  className={styles["form-input"]}
                  placeholder="Enter note title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Content</label>
                <textarea
                  className={`${styles["form-input"]} ${styles["form-textarea"]}`}
                  placeholder="Write your note content here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={styles.btn + " " + styles["btn-primary"]}
              >
                Add Note
              </button>
            </form>
          </section>

          {/* Notes List */}
          <section className={styles.section}>
            <div className={styles["notes-header"]}>
              <h2 className={styles["section-title"]}>Your Notes</h2>
              <span className={styles["notes-count"]}>
                {notes.length} notes
              </span>
            </div>

            <div className={styles["search-bar"]}>
              <input
                type="text"
                className={styles["search-input"]}
                placeholder="🔍 Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles["notes-grid"]}>
              {filteredNotes.map((n) => (
                <div key={n._id} className={styles["note-card"]}>
                  <div className={styles["note-title"]}>{n.title}</div>
                  <div className={styles["note-meta"]}>
                    <span>Created by: {n.owner?.email || "Unknown"}</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <div className={styles["note-content"]}>{n.content}</div>
                  <div className={styles["note-actions"]}>
                    <button
                      className={styles.btn + " " + styles["btn-secondary"]}
                      onClick={() => deleteNote(n._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles["right-column"]}>
          <section className={styles.section}>
            <h2 className={styles["section-title"]}>Pro Features</h2>
            <div className={styles["pro-features"]}>
              <h4>✨ Active Pro Benefits</h4>
              <ul>
                <li>Unlimited notes & storage</li>
                <li>Advanced search & filters</li>
                <li>Team collaboration tools</li>
                <li>File attachments & exports</li>
                <li>Priority customer support</li>
                <li>Advanced analytics</li>
              </ul>
            </div>
          </section>

          {/* Invite */}
          <section className={styles.section}>
            <h2 className={styles["section-title"]}>Invite Team Member</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
              Add unlimited team members to your workspace
            </p>
            <form onSubmit={inviteUser} className={styles["invite-form"]}>
              <div className={styles["invite-input"]}>
                <label className={styles["form-label"]}>Email Address</label>
                <input
                  type="email"
                  className={styles["form-input"]}
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={styles.btn + " " + styles["btn-primary"]}
              >
                Invite
              </button>
            </form>
            {inviteMessage && <p>{inviteMessage}</p>}
          </section>

          <section className={styles.section}>
            <h2 className={styles["section-title"]}>Workspace Analytics</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className={styles.analyticsRow}>
                <span>Total Notes</span>
                <span>{notes.length}</span>
              </div>
              <div className={styles.analyticsRow}>
                <span>Team Members</span>
                <span>—</span>
              </div>
              <div className={styles.analyticsRow}>
                <span>Plan</span>
                <span style={{ color: "#15803D" }}>Pro</span>
              </div>
              <div className={styles.analyticsRow}>
                <span>Storage Used</span>
                <span>Unlimited</span>
              </div>
              <div className={styles.analyticsRow}>
                <span>This Month</span>
                <span style={{ color: "#15803D" }}>+{notes.length} notes</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles["section-title"]}>Recent Activity</h2>
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              <p>No recent activity yet.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminPro;
