import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/navbar/sidebar";
import Navbar from "./components/navbar/navabr";
import { useDispatch } from "react-redux";
import { logoutUser } from "./redux/slices/auth/authSlice.js";
import ScrollToTop from "../utils/ScrollToTop.jsx";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    localStorage.setItem("isLogin", false);
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [navigate, isLogin]);

  const formattedParts = location.pathname.split("/").filter(Boolean).map((part, index) => index === 0 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part.toLowerCase());

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        className="z-50"
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 overflow-x-hidden">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 lg:left-64 z-40">
          <Navbar toggleSidebar={toggleSidebar} title={formattedParts[0]} />
        </div>

        <main className="pt-20 p-6 flex-1 overflow-auto">
          {/* <LogoutConfirmModal /> */}
          <ScrollToTop />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;