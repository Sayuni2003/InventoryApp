import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRedirector = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    switch (user.role) {
      case "admin":
        navigate("/admin", { replace: true }); // future
        break;
      case "guest":
        navigate("/", { replace: true }); // read-only later
        break;
      case "user":
      default:
        navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  return null;
};

export default RoleRedirector;
