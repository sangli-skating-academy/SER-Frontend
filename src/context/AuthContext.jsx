import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    // Fetch user info from backend using the httpOnly cookie
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/users/me`,
      {
        credentials: "include",
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAuth({ user: data?.user || null, loading: false }))
      .catch(() => setAuth({ user: null, loading: false }));
  }, []);

  const logout = async () => {
    await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/users/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    setAuth({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
