"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import Signin from "@/components/Auth/SignIn";
import SignUp from "@/components/Auth/SignUp";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react/dist/iconify.js";

// User type for TypeScript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Navigation item interface
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  external?: boolean;
  dropdown?: NavItem[];
  isActive?: (path: string) => boolean;
}

// Dynamic navigation data
const navigationData: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: "solar:home-2-bold",
    isActive: (path) => path === "/"
  },
  {
    id: "courses",
    label: "Courses",
    href: "/courses",
    icon: "solar:book-bookmark-bold",
    badge: "New",
    isActive: (path) => path.startsWith("/courses")
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    icon: "solar:bag-3-bold",
    badge: "Sale",
    isActive: (path) => path.startsWith("/shop")
  },
  {
    id: "instructors",
    label: "Instructors",
    href: "/instructors",
    icon: "solar:users-group-two-rounded-bold",
    isActive: (path) => path.startsWith("/instructors")
  },
  {
    id: "resources",
    label: "Resources",
    href: "/resources",
    icon: "solar:library-bold",
    dropdown: [
      {
        id: "blog",
        label: "Blog",
        href: "/blog",
        icon: "solar:document-text-bold"
      },
      {
        id: "tutorials",
        label: "Tutorials",
        href: "/tutorials",
        icon: "solar:play-circle-bold"
      },
      {
        id: "downloads",
        label: "Downloads",
        href: "/downloads",
        icon: "solar:download-bold"
      }
    ],
    isActive: (path) => path.startsWith("/resources")
  },
  {
    id: "pricing",
    label: "Pricing",
    href: "/pricing",
    icon: "solar:tag-bold",
    isActive: (path) => path.startsWith("/pricing")
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    icon: "solar:phone-bold",
    isActive: (path) => path.startsWith("/contact")
  }
];

// User menu items for logged-in users
const userMenuItems: NavItem[] = [
  {
    id: "profile",
    label: "My Profile",
    href: "/profile",
    icon: "tabler:user"
  },
  {
    id: "courses",
    label: "My Courses",
    href: "/my-courses",
    icon: "tabler:book",
    badge: 3
  },
  {
    id: "shop",
    label: "My Orders",
    href: "/my-orders",
    icon: "tabler:shopping-cart",
    badge: 2
  },
  {
    id: "certificates",
    label: "Certificates",
    href: "/certificates",
    icon: "tabler:award"
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: "tabler:settings"
  },
  {
    id: "help",
    label: "Help & Support",
    href: "/help",
    icon: "tabler:help-circle"
  }
];

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navbarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Check for login state on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Handle scroll for sticky header
  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  // Handle click outside to close dropdowns
  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false);
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false);
    }
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setIsProfileOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
    // Close dropdown when clicking outside
    if (activeDropdown) {
      setActiveDropdown(null);
    }
  };

  // Handle login
  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    setIsProfileOpen(false);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Check if a nav item is active
  const isNavItemActive = (item: NavItem): boolean => {
    if (item.isActive) {
      return item.isActive(pathUrl);
    }
    return pathUrl === item.href;
  };

  // Toggle dropdown
  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen, isProfileOpen, activeDropdown]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen || isProfileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen, isProfileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-300 bg-white dark:bg-gray-900 ${sticky ? "shadow-lg py-3" : "shadow-none py-5"
          }`}
      >
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-grow items-center justify-center">
            <ul className="flex items-center space-x-1">
              {navigationData.map((item) => (
                <li key={item.id} className="relative">
                  {item.dropdown ? (
                    // Dropdown menu item
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isNavItemActive(item) || activeDropdown === item.id
                            ? "text-primary bg-primary/10 dark:bg-primary/20"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {item.icon && (
                          <Icon icon={item.icon} className="text-xl" />
                        )}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <Icon 
                          icon="tabler:chevron-down" 
                          className={`text-sm transition-transform ${
                            activeDropdown === item.id ? "rotate-180" : ""
                          }`} 
                        />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.id && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.id}
                              href={dropdownItem.href}
                              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                isNavItemActive(dropdownItem)
                                  ? "text-primary bg-primary/10 dark:bg-primary/20"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              {dropdownItem.icon && (
                                <Icon icon={dropdownItem.icon} className="text-lg" />
                              )}
                              <span>{dropdownItem.label}</span>
                              {dropdownItem.badge && (
                                <span className="ml-auto px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                                  {dropdownItem.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular menu item
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isNavItemActive(item)
                          ? "text-primary bg-primary/10 dark:bg-primary/20"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.icon && (
                        <Icon icon={item.icon} className="text-xl" />
                      )}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.external && (
                        <Icon icon="tabler:external-link" className="text-sm" />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Icon icon="tabler:sun" className="text-xl text-gray-700 dark:text-gray-300" />
              ) : (
                <Icon icon="tabler:moon" className="text-xl text-gray-700 dark:text-gray-300" />
              )}
            </button>
            
            {/* Cart Icon (visible for all users) */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Shopping cart"
            >
              <Icon icon="solar:bag-3-bold" className="text-xl text-gray-700 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            
            {/* When Not Logged In */}
            {!isLoggedIn && (
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUpOpen(true)}
                  className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </button>
                {isSignInOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                      ref={signInRef}
                      className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-white dark:bg-gray-800"
                    >
                      <button
                        onClick={() => setIsSignInOpen(false)}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close Sign In Modal"
                      >
                        <Icon
                          icon="tabler:x"
                          className="text-xl text-gray-700 dark:text-gray-300"
                        />
                      </button>
                      <Signin onLogin={handleLogin} />
                    </div>
                  </div>
                )}
                {isSignUpOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                      ref={signUpRef}
                      className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-8 pt-14 pb-8 text-center"
                    >
                      <button
                        onClick={() => setIsSignUpOpen(false)}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close Sign Up Modal"
                      >
                        <Icon
                          icon="tabler:x"
                          className="text-xl text-gray-700 dark:text-gray-300"
                        />
                      </button>
                      <SignUp onLogin={handleLogin} />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* When Logged In */}
            {isLoggedIn && user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="User profile"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <Icon icon="tabler:chevron-down" className="text-sm text-gray-700 dark:text-gray-300" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <Icon icon={item.icon} className="text-lg" />}
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Icon icon="tabler:logout" className="text-lg" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all ${navbarOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 mt-1.5 transition-all ${navbarOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-300 mt-1.5 transition-all ${navbarOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {navbarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setNavbarOpen(false)} />
      )}
      
      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 ${navbarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            <Logo />
          </h2>
          <button
            onClick={() => setNavbarOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <Icon icon="tabler:x" className="text-xl text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <nav className="flex flex-col p-4 overflow-y-auto h-full pb-24">
          {/* Navigation Items */}
          <ul className="space-y-1 mb-4">
            {navigationData.map((item) => (
              <li key={item.id}>
                {item.dropdown ? (
                  // Dropdown menu item for mobile
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                        isNavItemActive(item) || activeDropdown === item.id
                          ? "text-primary bg-primary/10 dark:bg-primary/20"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <Icon icon={item.icon} className="text-xl" />
                        )}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <Icon 
                        icon="tabler:chevron-down" 
                        className={`text-sm transition-transform ${
                          activeDropdown === item.id ? "rotate-180" : ""
                        }`} 
                      />
                    </button>
                    
                    {/* Dropdown Menu for Mobile */}
                    {activeDropdown === item.id && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <li key={dropdownItem.id}>
                            <Link
                              href={dropdownItem.href}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                                isNavItemActive(dropdownItem)
                                  ? "text-primary bg-primary/10 dark:bg-primary/20"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                              onClick={() => setNavbarOpen(false)}
                            >
                              {dropdownItem.icon && (
                                <Icon icon={dropdownItem.icon} className="text-lg" />
                              )}
                              <span>{dropdownItem.label}</span>
                              {dropdownItem.badge && (
                                <span className="ml-auto px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                                  {dropdownItem.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Regular menu item for mobile
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isNavItemActive(item)
                        ? "text-primary bg-primary/10 dark:bg-primary/20"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setNavbarOpen(false)}
                  >
                    {item.icon && (
                      <Icon icon={item.icon} className="text-xl" />
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.external && (
                      <Icon icon="tabler:external-link" className="text-sm" />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          {/* Theme Toggle in Mobile Menu */}
          <button
            onClick={() => {
              toggleTheme();
              setNavbarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon icon={theme === "dark" ? "tabler:sun" : "tabler:moon"} className="text-xl" />
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          
          {/* Cart in Mobile Menu */}
          <Link
            href="/cart"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setNavbarOpen(false)}
          >
            <div className="relative">
              <Icon icon="solar:bag-3-bold" className="text-xl" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </div>
            <span>Shopping Cart</span>
          </Link>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {!isLoggedIn ? (
              <div className="flex flex-col space-y-3 w-full">
                <button
                  onClick={() => {
                    setIsSignInOpen(true);
                    setNavbarOpen(false);
                  }}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSignUpOpen(true);
                    setNavbarOpen(false);
                  }}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 w-full">
                <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                {/* User Menu Items for Mobile */}
                <ul className="space-y-1">
                  {userMenuItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setNavbarOpen(false)}
                      >
                        {item.icon && <Icon icon={item.icon} className="text-xl" />}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setNavbarOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
                    >
                      <Icon icon="tabler:logout" className="text-xl" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;