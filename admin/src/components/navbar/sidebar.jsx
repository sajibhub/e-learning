import { useRef, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaLayerGroup,
  FaVideo,
  FaBox,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setLogoutModal, logoutUser } from "../../redux/slices/auth/authSlice.js";


const sidebarItems = [
  {
    name: "Dashboard",
    router: "/",
    baseRouter: "/",
    icon: <FaTachometerAlt className="w-5 h-5" />
  },
  {
    name: "Users",
    router: "/users/1/10",
    baseRouter: "/users",
    icon: <FaUsers className="w-5 h-5" />
  },
  {
    name: "Courses",
    router: "/courses/1/10",
    baseRouter: "/courses",
    icon: <FaBookOpen className="w-5 h-5" />
  },
  {
    name: "Modules",
    router: "/modules/1/10",
    baseRouter: "/modules",
    icon: <FaLayerGroup className="w-5 h-5" />
  },
  {
    name: "Videos",
    router: "/videos/1/10",
    baseRouter: "/videos",
    icon: <FaVideo className="w-5 h-5" />
  },
  {
    name: "Products",
    router: "/products/1/10",
    baseRouter: "/products",
    icon: <FaBox className="w-5 h-5" />
  },
  {
    name: "Orders",
    router: "/orders/1/10",    
    baseRouter: "/orders",
    icon: <FaShoppingCart className="w-5 h-5" />,
  },
  {
    name: "Settings",
    router: "/settings",
    baseRouter: "/settings",
    icon: <FaCog className="w-5 h-5" />,
  },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logoutLoading, isLogoutModalOpen } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = e => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && isOpen) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  const handleLogoutClick = () => {
    dispatch(setLogoutModal(true));
  };

  const handleCloseModal = () => dispatch(setLogoutModal(false));

  const handleConfirmLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      const isLogin = JSON.parse(localStorage.getItem("isLogin"));
      if (!isLogin) navigate("/login");
      dispatch(setLogoutModal(false));
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Determine the active sidebar item using baseRouter
  const getActiveSidebarItem = () => {
    const sortedItems = [...sidebarItems].sort((a, b) => b.baseRouter.length - a.baseRouter.length);
    return sortedItems.find(item => location.pathname.startsWith(item.baseRouter));
  };

  const activeItem = getActiveSidebarItem();

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarItems.map(item => {
                const isActive = activeItem?.router === item.router;
                return (
                  <li key={item.router}>
                    <button
                      onClick={() => {
                        navigate(item.router);
                        toggleSidebar(); // auto-close on mobile
                      }}
                      className={`flex items-center space-x-3 w-full cursor-pointer p-3 rounded-xl transition-colors 
                    ${isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-gray-700 hover:text-white"}`}
                    >
                      <span className="flex items-center justify-center">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogoutClick}
              disabled={logoutLoading}
              className={`w-full flex items-center cursor-pointer space-x-3 p-3 rounded-xl transition-colors 
            ${logoutLoading ? "bg-gray-600 cursor-not-allowed" : "hover:bg-red-600 hover:text-white"}`}
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">{logoutLoading ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Confirm Logout</h3>
              <button
                onClick={handleCloseModal}
                className="text-white/60 hover:text-white"
                disabled={logoutLoading}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Message */}
            <p className="text-white/80 mb-6">
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>

            {/* Buttons */}
            <div className="flex space-x-4">

              {/* Cancel Button */}
              <button
                onClick={handleCloseModal}
                disabled={logoutLoading}
                className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Cancel
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmLogout}
                disabled={logoutLoading}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {logoutLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"></path>
                  </svg>
                )}
                <span>{logoutLoading ? "Logging out..." : "Yes, Log Out"}</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;