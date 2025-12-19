import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Guest access
  if (!user && allowedRoles.includes("guest")) {
    return children;
  }

  // Logged-in role check
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
