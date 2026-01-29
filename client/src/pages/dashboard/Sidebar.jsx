import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaTimes,
  FaBars,
  FaUser,
  FaBook,
  FaShoppingBag,
  FaCertificate,
  FaSignOutAlt,
  FaHome,
  FaEdit,
  FaTachometerAlt
} from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.setItem("isLogin", "false");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
      ? "bg-blue-600 text-white shadow-md"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      end: true // Only active when exact path matches
    },
    {
      path: "/dashboard/profile",
      label: "Profile Information",
      icon: <FaUser />
    },
    {
      path: "/dashboard/profileUpdate",
      label: "Profile Edit",
      icon: <FaEdit />
    },
    {
      path: "/dashboard/courses",
      label: "My Courses",
      icon: <FaBook />
    },
    {
      path: "/dashboard/products",
      label: "My Products",
      icon: <FaShoppingBag />
    },
    {
      path: "/dashboard/certificates",
      label: "Certificates",
      icon: <FaCertificate />
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-blue-600">Dashboard</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                  end={item.end || false} // Use the end prop for exact matching
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;