import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && (!auth.user || auth.user.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <div className="text-lg font-semibold text-gray-500">
          Checking admin access...
        </div>
      </div>
    );
  }

  if (!auth.user || auth.user.role !== "admin") {
    return null;
  }

  return children;
}
