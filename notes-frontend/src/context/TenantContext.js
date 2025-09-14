import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const TenantContext = createContext();

export const TenantProvider = ({ token, user, children }) => {
  const [tenantPlan, setTenantPlan] = useState(null);
  const [loadingTenant, setLoadingTenant] = useState(true);

useEffect(() => {
  if (!token || !user?.tenant) {
    setTenantPlan("free");
    setLoadingTenant(false);
    return;
  }

  const fetchTenant = async () => {
    try {
      const res = await api.get(`/tenants/${user.tenant}`);
      setTenantPlan(res.data.plan || "free"); 
    } catch (err) {
      console.error("Failed to fetch tenant plan:", err);
      setTenantPlan("free"); 
    } finally {
      setLoadingTenant(false); 
    }
  };

  fetchTenant();
}, [token, user.tenant]);

  return (
    <TenantContext.Provider value={{ tenantPlan, setTenantPlan, loadingTenant }}>
      {children}
    </TenantContext.Provider>
  );
};
