import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import {
  FaBell,
  FaSearch,
  FaSignOutAlt
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "User", email: "" });
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user info from localStorage
  useEffect(() => {
    try {
      const isLogin = localStorage.getItem("isLogin");
      if (isLogin === "true") {
        setUser({
          name: localStorage.getItem("userName") || "User",
          email: localStorage.getItem("userEmail") || ""
        });
      }
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLogin", "false");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}


        {/* Dashboard Home Component or Nested Routes */}
        <Outlet>
          {/* Default content when no nested route is active */}
          <DashboardHome user={user} />
        </Outlet>
      </main>
    </div>
  );
};

export default Dashboard;