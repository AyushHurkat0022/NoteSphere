import React from "react";

function NoteItem({ note, onDelete }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "15px",
      margin: "10px 0",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      backgroundColor: "#fff"
    }}>
      <h4 style={{ marginBottom: "8px" }}>{note.title}</h4>
      <p style={{ marginBottom: "10px" }}>{note.content}</p>
      <button
        onClick={onDelete}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          background: "#FF6B6B",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default NoteItem;
