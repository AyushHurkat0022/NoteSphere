/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import api from "../api";
import styles from "./AuthPage.module.css";

function Login({ setToken }) {
  const [tenant, setTenant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { tenant, email, password });
      
      // Save token and user
      setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      // Show backend error or fallback
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles["login-header"]}>
        <h1 className={styles["login-title"]}>Notes App Login</h1>
        <p className={styles["login-subtitle"]}>Sign in to your workspace</p>
      </div>

      {error && (
        <div className={styles["error-message"]} style={{ display: "block" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>Tenant</label>
          <input
            className={styles["form-input"]}
            placeholder="your-company"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            required
          />
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>Email</label>
          <input
            className={styles["form-input"]}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>Password</label>
          <input
            className={styles["form-input"]}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={styles["login-button"]}
          disabled={loading}
        >
          {loading && <span className={styles.loading}></span>}
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className={styles["forgot-password"]}>
        <a onClick={() => alert("Hi, Ayush this side. Forgot password functionality here.")}>
          Forgot your password?
        </a>
      </div>

      <div className={styles.divider}>
        <span>New to Notes App?</span>
      </div>
    </div>
  );
}

export default Login;
