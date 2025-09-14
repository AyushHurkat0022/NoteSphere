import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import styles from "./AuthPage.module.css";

function AuthPage({ setToken }) {
  const [mode, setMode] = useState("login"); // login or register

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["auth-card"]}>
        {mode === "login" ? <Login setToken={setToken} /> : <Register setToken={setToken} />}
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            style={{ color: "#4F46E5", cursor: "pointer", fontWeight: "bold" }}
          >
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
