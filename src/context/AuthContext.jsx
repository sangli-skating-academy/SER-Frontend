import { createContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/apiConfig";
import { getAuthToken } from "../utils/authHelpers";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    const token = getAuthToken();
    // Fetch user info from backend using the httpOnly cookie
    fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include", // Use cookies if available
      headers: token ? { Authorization: `Bearer ${token}` } : {}, // Fallback to token
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAuth({ user: data?.user || null, loading: false }))
      .catch(() => setAuth({ user: null, loading: false }));
  }, []);

  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("auth_token"); // Clear token from localStorage
    setAuth({ user: null, loading: false });
  };

  const updateAuth = (user) => {
    setAuth({ user, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: updateAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
