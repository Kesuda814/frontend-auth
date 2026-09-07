import { useState, useEffect } from "react";
import { UserContext } from "./authContext";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const loading = false; // direct boolean to satisfy linter

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${API_URL}/api/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [API_URL]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, API_URL }}>
      {children}
    </UserContext.Provider>
  );
}