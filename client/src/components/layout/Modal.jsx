import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ children, onClose, title = "" }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-700/60 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Modal container with slide animation */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white text-left shadow-2xl transition-all duration-500 ease-out animate-slide-down"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/10 pointer-events-none"></div>
          
          {/* Modal Header */}
          {title && (
            <div className="relative border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
          )}
          
          {/* Close Button */}
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes className="h-4 w-4" />
          </button>
          
          {/* Modal Content */}
          <div className={`relative ${title ? "px-6 py-5" : "p-6"}`}>
            {children}
          </div>
          
          {/* Decorative element */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;