import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import NoteItem from "../components/NoteItem";
import Confetti from "react-confetti";
import styles from "./AdminFree.module.css";
import { TenantContext } from "../context/TenantContext";
// import { useNavigate } from "react-router-dom";

function AdminFree({ setToken }) {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [message, setMessage] = useState("");
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { tenantPlan, setTenantPlan } = useContext(TenantContext);
  // const navigate = useNavigate();

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

  useEffect(() => {
  if (tenantPlan === "pro") return; 
  }, [tenantPlan]);


  const addNote = async () => {
    if (!newTitle || !newContent) return;
    if (notes.length >= 3) {
      setMessage("Free Plan limit reached! Upgrade to Pro for unlimited notes.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    try {
      const res = await api.post("/notes", { title: newTitle, content: newContent });
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
      setMessage(err.response?.data?.error || "Error deleting note");
    }
  };

// ...

const upgradePlan = async () => {
  if (tenantPlan === "pro") return; 
  setLoadingUpgrade(true);
  setMessage("");

  try {
    const res = await api.post(`/tenants/${user.tenant}/upgrade`);
    const newPlan = res.data.tenant.plan;

    setTimeout(() => {
      setTenantPlan(newPlan);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setMessage("🎉 Upgraded to Pro! 🎉");
      setLoadingUpgrade(false);
    }, 2000);
  } catch (err) {
    setMessage(err.response?.data?.error || "Upgrade failed");
    setLoadingUpgrade(false);
  }
};

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };

  return (
    <div className={styles.container}>
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} gravity={0.3} />}
      {loadingUpgrade && (
  <div className={styles.overlay}>
    <div className={styles.processingBox}>
      <div className={styles.spinner}></div>
      <p>Processing your request...</p>
      <p>Upgrading to Pro...</p>
    </div>
  </div>
)}


      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles["user-info"]}>
          <div>{user.email}</div>
          <div style={{ color: "#6B7280", fontSize: 12 }}>
            {user.tenant} - Admin (Free)
          </div>
          <button className={styles["logout-button"]} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles["main-content"]}>
        {/* Left Column */}
        <div className={styles["left-column"]}>
          <section className={styles.section}>
            <h2>Create New Note</h2>
            <input
              className={styles.input}
              placeholder="Enter note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Write your note content here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button className={styles["btn-primary"]} onClick={addNote}>
              Add Note
            </button>
            {message && <p className={styles.message}>{message}</p>}
          </section>

          <section>
            <h2>Your Notes</h2>
            <div className={styles["notes-grid-free"]}>
              {notes.map((n) => (
                <NoteItem
                  key={n._id}
                  note={n}
                  onDelete={() => deleteNote(n._id)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className={styles["right-column"]}>
          <section className={styles.section}>
            <h2 className={styles["section-title"]}>Upgrade to Pro</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
              Unlock unlimited notes, collaboration, analytics, and more.
            </p>
            <button className={styles["btn-upgrade"]} onClick={upgradePlan}>
              Upgrade Now
            </button>
          </section>

          <section className={`${styles.section} ${styles.locked}`}>
            <h2 className={styles["section-title"]}>Pro Features</h2>
            <div className={styles["pro-features"]}>
              <h4>✨ Available with Pro</h4>
              <ul>
                <li>Unlimited notes & storage</li>
                <li>Advanced search & filters</li>
                <li>Team collaboration tools</li>
                <li>File attachments & exports</li>
                <li>Priority customer support</li>
                <li>Advanced analytics</li>
              </ul>
            </div>
            <div className={styles["locked-overlay"]}>Upgrade to unlock</div>
          </section>

          <section className={`${styles.section} ${styles.locked}`}>
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
                <span style={{ color: "#B91C1C" }}>Free</span>
              </div>
              <div className={styles.analyticsRow}>
                <span>Storage Used</span>
                <span>Limited</span>
              </div>
              <div className={styles.analyticsRow}>
                <span>This Month</span>
                <span style={{ color: "#B91C1C" }}>Limited</span>
              </div>
            </div>
            <div className={styles["locked-overlay"]}>Upgrade to unlock</div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminFree;
