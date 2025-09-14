import { Routes, Route, Navigate } from "react-router-dom";
import AdminFree from "./pages/AdminFree";
import AdminPro from "./pages/AdminPro";
import Member from "./pages/Member";
import AuthPage from "./pages/AuthPage";
import { TenantProvider, TenantContext } from "./context/TenantContext";
import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  if (!token) return <AuthPage setToken={setToken} />;

  return (
    <TenantProvider token={token} user={user}>
      <TenantContext.Consumer>
        {({ tenantPlan, loadingTenant }) => {
          if (loadingTenant) return <div style={{ textAlign: "center", marginTop: 50 }}>Loading tenant info...</div>;
          if (!tenantPlan) return <p style={{ textAlign: "center" }}>Unable to load tenant plan.</p>;

          return (
            <Routes>
              {user.role === "admin" && (
                tenantPlan === "pro" 
                  ? <Route path="/*" element={<AdminPro setToken={setToken} />} />
                  : <Route path="/*" element={<AdminFree setToken={setToken} />} />
              )}
              {user.role !== "admin" && <Route path="/*" element={<Member setToken={setToken} />} />}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          );
        }}
      </TenantContext.Consumer>
    </TenantProvider>
  );
}

export default App;
