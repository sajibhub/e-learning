import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, isdeleteModal } from "../../redux/slices/users/usersSlice.js";

const DeleteUserModal = ({ selectedUser }) => {
  const dispatch = useDispatch();
  const { isdeleteModalOpen, deleteLoading } = useSelector((state) => state.users);

  if (!isdeleteModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={() => dispatch(isdeleteModal(false))}
    >
      <div
        className="bg-[#1e293b]/60 backdrop-blur-md border border-gray-700 rounded-2xl w-full max-w-md md:max-w-lg p-6 md:p-7 shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative mb-3">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              {deleteLoading ? (
                <div className="w-8 h-8 border-2 border-white/30 border-t-red-500 rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </div>
            {!deleteLoading && (
              <div className="absolute inset-0 rounded-full animate-ping bg-red-500/30 opacity-60"></div>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-center text-white">
            {deleteLoading ? "Deleting User..." : "Confirm Deletion"}
          </h2>
          <p className="text-sm text-gray-400 mt-1 text-center">
            {deleteLoading
              ? "Please wait while we process your request"
              : "This action cannot be undone"}
          </p>
        </div>

        {/* User Info */}
        {!deleteLoading && selectedUser && (
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">{selectedUser.name}</h3>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUser.status
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {selectedUser.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => dispatch(isdeleteModal(false))}
            disabled={deleteLoading}
            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedUser && dispatch(deleteUser(selectedUser._id))}
            disabled={deleteLoading}
            className="px-5 py-2.5 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            {deleteLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
