import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({ token, user: decoded });
      } catch (err) {
        console.error("Invalid token", err);
        Cookies.remove("auth_token");
      }
    }
  }, []);

  const login = (token) => {
    const user = jwtDecode(token);
    Cookies.set("auth_token", token, {
      expires: 7, // days
      secure: true,
      sameSite: "strict",
    });
    setAuth({ token, user });
  };

  const logout = () => {
    Cookies.remove("auth_token");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
