import { NavLink, useNavigate } from "react-router-dom";
import { UserCircle, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Common link styling logic
  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive
        ? "text-blue-500 border-blue-500"
        : "text-neutral-300 hover:text-white"
    }`;

  return (
    <nav className="w-full bg-neutral-900 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl font-semibold text-blue-500">InventoryApp</div>

        {/* Center: Navigation */}
        <div className="flex gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/inventories" className={navLinkClass}>
            Inventories
          </NavLink>
        </div>

        {/* Right: Profile + Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-neutral-300">
            <UserCircle size={22} />
            <span className="font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm font-medium
                       text-white bg-red-600 rounded-md
                       hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
