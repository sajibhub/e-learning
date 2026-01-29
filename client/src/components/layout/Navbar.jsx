import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiHome, FiBook, FiShoppingBag, FiMail, FiLoader } from "react-icons/fi";
import Login from "../../pages/auth/Login";
import Signup from "../../pages/auth/Signup";
import Modal from "./Modal"; // Assuming Modal is in the same directory or adjust the import path
import { logoutAPI } from "../../api/auth.api";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuAnimating, setMobileMenuAnimating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();
  const timeoutRef = useRef();

  /* Auth Check */
  useEffect(() => {
    const isLogin = JSON.parse(localStorage.getItem("isLogin") || "false");
    setIsLoggedIn(isLogin);
  }, []);

  /* Handle scroll effect */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Handle mobile menu animation */
  useEffect(() => {
    if (open) {
      setMobileMenuAnimating(true);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Add a small delay before removing the animation class
      timeoutRef.current = setTimeout(() => {
        setMobileMenuAnimating(false);
      }, 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  /* Logout */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAPI()
      // Clear auth data
      localStorage.setItem("isLogin", "false");
      setIsLoggedIn(false);
      setShowLogoutModal(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still log out locally even if API call fails
      localStorage.setItem("isLogin", "false");
      setIsLoggedIn(false);
      setShowLogoutModal(false);
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  /* Close mobile menu when route changes */
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <>
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-lg py-2'
        : 'bg-white shadow-md py-4'
        }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-lg">
              <img src="/logo.png" className="h-10 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduPlatform
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-8 font-medium">
            <NavIconLink to="/" icon={<FiHome />}>Home</NavIconLink>
            <NavIconLink to="/courses" icon={<FiBook />}>Courses</NavIconLink>
            <NavIconLink to="/shop" icon={<FiShoppingBag />}>Shop</NavIconLink>
            <NavIconLink to="/contact" icon={<FiMail />}>Contact</NavIconLink>
          </ul>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="relative overflow-hidden px-5 py-2.5 rounded-full border border-blue-500 text-blue-500 hover:text-white group"
                >
                  <span className="relative z-10 transition-colors duration-300">Login</span>
                  <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>

                <button
                  onClick={() => setShowSignupModal(true)}
                  className="relative overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            ) : (
              /* User Menu */
              <div className="relative" ref={dropdownRef}>

                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <FiUser />
                  </div>
                  <span className="font-medium">Account</span>
                  <FiChevronDown className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 origin-top-right scale-100 opacity-100">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <FiUser />
                      </div>
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <FiLogOut />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          >
            <div className={`absolute transition-all duration-300 ${open ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
              <FiMenu className="text-xl" />
            </div>
            <div className={`absolute transition-all duration-300 ${open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
              <FiX className="text-xl" />
            </div>
          </button>
        </div>


        {/* MOBILE MENU */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'
          }`}>
          <div className="bg-white shadow-lg border-t">
            <ul className="flex flex-col p-5 gap-2 font-medium">
              <MobileIconLink to="/" icon={<FiHome />} setOpen={setOpen}>Home</MobileIconLink>
              <MobileIconLink to="/courses" icon={<FiBook />} setOpen={setOpen}>Courses</MobileIconLink>
              <MobileIconLink to="/shop" icon={<FiShoppingBag />} setOpen={setOpen}>Shop</MobileIconLink>
              <MobileIconLink to="/contact" icon={<FiMail />} setOpen={setOpen}>Contact</MobileIconLink>

              <div className="my-2 border-t border-gray-200"></div>

              {!isLoggedIn ? (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <FiUser />
                      </div>
                      <span>Login</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowSignupModal(true);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <FiUser />
                      </div>
                      <span>Sign Up</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <MobileIconLink to="/dashboard" icon={<FiUser />} setOpen={setOpen}>
                    Dashboard
                  </MobileIconLink>

                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 py-2 text-red-500"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <FiLogOut />
                    </div>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <Modal
          title="Login to Your Account"
          onClose={() => setShowLoginModal(false)}
        >
          <Login
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              setShowLoginModal(false);
            }}
            onSignupClick={() => {
              setShowLoginModal(false);
              setShowSignupModal(true);
            }}
          />
        </Modal>
      )}

      {/* SIGNUP MODAL */}
      {showSignupModal && (
        <Modal
          title="Create Your Account"
          onClose={() => setShowSignupModal(false)}
        >
          <Signup
            onClose={() => setShowSignupModal(false)}
            onSignupSuccess={() => {
              setIsLoggedIn(true);
              setShowSignupModal(false);
            }}
            onLoginClick={() => {
              setShowSignupModal(false);
              setShowLoginModal(true);
            }}
          />
        </Modal>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          ></div>

          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                {isLoggingOut ? (
                  <FiLoader className="text-2xl text-red-500 animate-spin" />
                ) : (
                  <FiLogOut className="text-2xl text-red-500" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-center mb-2">
              {isLoggingOut ? "Logging Out..." : "Confirm Logout"}
            </h3>

            <p className="text-gray-500 text-center mb-6">
              {isLoggingOut 
                ? "Please wait while we log you out." 
                : "Are you sure you want to logout from your account?"
              }
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => !isLoggingOut && setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className={`px-6 py-2.5 rounded-full border transition-colors duration-200 ${
                  isLoggingOut 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`px-6 py-2.5 rounded-full transition-colors duration-200 flex items-center ${
                  isLoggingOut 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isLoggingOut ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Logging Out...
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main className="min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};

/* Desktop Nav Link with Icon */
const NavIconLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

/* Mobile Link with Icon */
const MobileIconLink = ({ to, icon, children, setOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${isActive
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive
          ? 'bg-blue-100 text-blue-600'
          : 'bg-gray-100 text-gray-600'
          }`}>
          {icon}
        </div>
        <span>{children}</span>
      </Link>
    </li>
  );
};

/* Mobile Link */
const MobileLink = ({ to, children, setOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className={`block py-2 px-3 rounded-lg transition-all duration-200 ${isActive
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }`}
      >
        {children}
      </Link>
    </li>
  );
};

export default Navbar;