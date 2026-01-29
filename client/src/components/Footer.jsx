import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaArrowRight
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-br from-sky-50 to-blue-100 pt-16 pb-8 text-gray-700">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="mb-6">
              <img 
                src="/logo.png" 
                alt="E-learning Logo" 
                className="w-24 h-24 mx-auto sm:mx-0 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://picsum.photos/seed/logo/100/100.jpg";
                }}
              />
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Empowering learners worldwide with quality education and innovative learning solutions.
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 relative">
              Quick Links
              <span className="absolute bottom-2 left-0 w-8 h-0.5 bg-blue-600 transform sm:translate-x-0 translate-x-1/2"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center sm:justify-start group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 relative">
              Services
              <span className="absolute bottom-2 left-0 w-8 h-0.5 bg-blue-600 transform sm:translate-x-0 translate-x-1/2"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center sm:justify-start group">
                  <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Online Courses
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center sm:justify-start group">
                  <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Digital Products
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center sm:justify-start group">
                  <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Certifications
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center sm:justify-start group">
                  <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 relative">
              Contact Info
              <span className="absolute bottom-2 left-0 w-8 h-0.5 bg-blue-600 transform sm:translate-x-0 translate-x-1/2"></span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start justify-center sm:justify-start group">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                  <FaMapMarkerAlt className="text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-gray-600 text-sm">Ullapara Bazar, Ullapara, Sirajgonj</p>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-center sm:justify-start group">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                  <FaPhone className="text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a href="tel:09638698024" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    09638698024
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-center sm:justify-start group">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                  <FaEnvelope className="text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:shawon10316641@gmail.com" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    shawon10316641@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

       

        {/* Bottom bar */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-center md:text-left">
            <p className="text-gray-600">
              © {currentYear} E-learning Platform. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-gray-600">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}