import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    // Fetch user info from backend using the httpOnly cookie
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/users/me`,
      {
        credentials: "include", // Use cookies if available
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Fallback to token
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAuth({ user: data?.user || null, loading: false }))
      .catch(() => setAuth({ user: null, loading: false }));
  }, []);

  const logout = async () => {
    await fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/api/users/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    localStorage.removeItem("auth_token"); // Clear token from localStorage
    setAuth({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
