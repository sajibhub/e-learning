import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { isUpdateModal, updateUser } from "../../redux/slices/users/usersSlice";

const UpdateUserModal = ({ user }) => {
  const dispatch = useDispatch();
  const { isUpdateModalOpen, updateLoading: loading } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    email: "",
    fee: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        _id: user._id,
        email: user.email || "",
        fee: user.fee || 0,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData))
  };

  if (!isUpdateModalOpen) return null;

  return (
    <div className="fixed inset-0  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <div className="relative rounded-xl w-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl
                    bg-white/10 backdrop-blur-xl border border-white/30">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Update User</h2>
          <button
            onClick={() => dispatch(isUpdateModal(false))}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Fee */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Fee *</label>
              <input
                type="text"
                name="fee"
                value={formData.fee}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    handleChange({
                      target: {
                        name: "fee",
                        value: value === "" ? "" : parseFloat(value),
                      },
                    });
                  }
                }}
                required
                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => dispatch(isUpdateModal(false))}
                className="px-5 py-2 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 cursor-pointer bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
