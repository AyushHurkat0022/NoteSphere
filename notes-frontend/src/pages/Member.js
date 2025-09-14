import React, { useEffect, useState } from "react";
import api from "../api";
import styles from "./Member.module.css";

function Member({ setToken }) {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage("Note added successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating note");
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

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  // Avatar initials
  const initials = user.email ? user.email.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Welcome, {user.name || "Member"}!</h1>
        <div className={styles["user-info"]}>
          <div className={styles["user-avatar"]}>{initials}</div>
          <div className={styles["user-details"]}>
            <span className={styles["user-name"]}>{user.email}</span>
            {user.username && <span className={styles["user-username"]}>@{user.username}</span>}
            {user.joinedAt && (
              <span className={styles["user-joined"]}>
                Joined: {new Date(user.joinedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <button
            className={`${styles.btn} ${styles["btn-secondary"]}`}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className={styles["stats-section"]}>
        <h2>Account Stats</h2>
        <div className={styles["stats-grid"]}>
          <div className={styles["stat-card"]}>
            <span className={styles["stat-number"]}>{notes.length}</span>
            <span className={styles["stat-label"]}>Notes</span>
          </div>
          {user.role && (
            <div className={styles["stat-card"]}>
              <span className={styles["stat-number"]}>{user.role}</span>
              <span className={styles["stat-label"]}>Role</span>
            </div>
          )}
        </div>
      </section>

      {/* Create Note */}
      <section className={styles["create-section"]}>
        <h2>Create New Note</h2>
        <form onSubmit={addNote}>
          <div className={styles["form-group"]}>
            <label>Title</label>
            <input
              type="text"
              className={styles["form-input"]}
              placeholder="Enter note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className={styles["form-group"]}>
            <label>Content</label>
            <textarea
              className={`${styles["form-input"]} ${styles["form-textarea"]}`}
              placeholder="Write your note content here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <button type="submit" className={`${styles.btn} ${styles["btn-primary"]}`}>
            Add Note
          </button>
          {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
        </form>
      </section>

      <section>
        <h2 className={styles["section-title"]}>Your Notes</h2>
        <div className={styles["notes-grid"]}>
          {notes.length === 0 && <p>No notes yet. Add one above!</p>}
          {notes.map((n) => (
            <div key={n._id} className={styles["note-card"]}>
              <div className={styles["note-header"]}>
                <div className={styles["note-title"]}>{n.title}</div>
                <span className={styles["note-date"]}>
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles["note-content"]}>{n.content}</div>
              <div className={styles["note-actions"]}>
                <button
                  className={`${styles.btn} ${styles["btn-secondary"]}`}
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
  );
}

export default Member;
