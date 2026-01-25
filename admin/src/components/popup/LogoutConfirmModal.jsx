import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogoutModal, logoutUser } from "../../redux/slices/users/authSlice.js";

const LogoutConfirmModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogoutModalOpen, logoutLoading } = useSelector((state) => state.auth);

  if (!isLogoutModalOpen) return null;

  const handleClose = () => dispatch(setLogoutModal(false));

  const handleConfirm = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      const isLogin = JSON.parse(localStorage.getItem("isLogin"));
      if (!isLogin) navigate("/login");
      dispatch(setLogoutModal(false));
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Confirm Logout</h3>
          <button 
            onClick={handleClose} 
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
            onClick={handleClose}
            disabled={logoutLoading}
            className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Cancel
          </button>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
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
  );
};

export default LogoutConfirmModal;
