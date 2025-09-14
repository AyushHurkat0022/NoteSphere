import React, { useState } from "react";
import api from "../api";

function Register({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", { email, password, tenant });
      setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          placeholder="Tenant (acme / globex)"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>}
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  margin: "8px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#6B73FF",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};

export default Register;
