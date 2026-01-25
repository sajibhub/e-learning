import React, { useState, useEffect, useRef } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCamera, 
  FaSave, 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle,
  FaHome,
  FaKey
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { readProfile, updateProfile } from "../redux/slices/profile/profileSlice.js";

// Skeleton loader component
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div className="max-w-4xl mx-auto">
      <div className="h-10 w-48 bg-gray-700 rounded-lg mb-8 animate-pulse"></div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Tabs skeleton */}
        <div className="flex border-b border-gray-700">
          <div className="h-12 w-24 bg-gray-700 animate-pulse"></div>
          <div className="h-12 w-24 bg-gray-700 animate-pulse ml-4"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile image skeleton */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mb-4 animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse mb-2"></div>
            </div>
            
            {/* Form skeleton */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-700 rounded-lg animate-pulse md:col-span-2"></div>
              </div>
              <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { profile, loading, updateLoading, error } = useSelector((state) => state.profile);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  
  const fileInputRef = useRef(null);
  
  // Fetch profile on component mount
  useEffect(() => {
    dispatch(readProfile());
  }, [dispatch]);
  
  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setImagePreview(profile.profile || "");
    }
  }, [profile]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({ 
          ...prev, 
          profileImage: "Image size should be less than 5MB" 
        }));
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setFieldErrors(prev => ({ 
          ...prev, 
          profileImage: "Please select an image file" 
        }));
        return;
      }
      
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear any previous image error
      if (fieldErrors.profileImage) {
        setFieldErrors(prev => ({ ...prev, profileImage: "" }));
      }
    }
  };
  
  // Validate form - only validate fields that are being changed
  const validateForm = () => {
    const errors = {};
    let hasChanges = false;
    
    // Check if name has changed
    if (formData.name !== profile?.name) {
      hasChanges = true;
      if (!formData.name.trim()) {
        errors.name = "Name is required";
      }
    }
    
    // Check if email has changed
    if (formData.email !== profile?.email) {
      hasChanges = true;
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
      }
    }
    
    // Check if address has changed
    if (formData.address !== profile?.address) {
      hasChanges = true;
    }
    
    // Check if profile image has changed
    if (profileImage) {
      hasChanges = true;
    }
    
    // Check if password fields are filled (password change)
    if (showPasswordFields && (formData.oldPassword || formData.newPassword || formData.confirmPassword)) {
      hasChanges = true;
      
      if (!formData.oldPassword) {
        errors.oldPassword = "Current password is required";
      }
      
      if (!formData.newPassword) {
        errors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters";
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    // If no changes were made, show an error
    if (!hasChanges) {
      errors.noChanges = "Please make at least one change to update your profile";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare update data - only include fields that have changed
    const updateData = {};
    
    // Only include name if it has changed
    if (formData.name !== profile?.name) {
      updateData.name = formData.name;
    }
    
    // Only include email if it has changed
    if (formData.email !== profile?.email) {
      updateData.email = formData.email;
    }
    
    // Only include address if it has changed
    if (formData.address !== profile?.address) {
      updateData.address = formData.address;
    }
    
    // Include profile image if it has changed
    if (profileImage) {
      updateData.profileImage = profileImage;
    }
    
    // Include password fields if they are filled
    if (showPasswordFields && (formData.oldPassword || formData.newPassword || formData.confirmPassword)) {
      updateData.oldPassword = formData.oldPassword;
      updateData.password = formData.newPassword; // Changed from newPassword to password
    }
    
    // Dispatch update action
    dispatch(updateProfile(updateData))
      .unwrap()
      .then(() => {
        setSuccessMessage("Profile updated successfully!");
        setShowPasswordFields(false);
        setFormData(prev => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        // Clear any profile image state after successful update
        setProfileImage(null);
      })
      .catch((err) => {
        setSuccessMessage(err.message || "Failed to update profile");
      });
  };
  
  // Toggle password fields
  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    setFormData(prev => ({
      ...prev,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    // Clear password errors when toggling
    if (showPasswordFields) {
      setFieldErrors(prev => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };
  
  // Show skeleton while loading
  if (loading && !profile) {
    return <ProfileSkeleton />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="ml-4 h-px bg-gray-700 flex-grow"></div>
        </div>
        
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/50 text-green-100 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <FaCheck className="mr-2" />
              {successMessage}
            </div>
            <button 
              onClick={() => setSuccessMessage("")} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        )}
        
        {fieldErrors.noChanges && (
          <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 text-yellow-100 px-4 py-3 rounded-lg mb-6 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {fieldErrors.noChanges}
          </div>
        )}
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
          {/* Tabs */}
          <div className="flex border-b border-gray-700/50">
            <button
              className={`px-6 py-4 font-medium transition-all duration-300 ${
                activeTab === "profile" 
                  ? "text-blue-400 border-b-2 border-blue-400 bg-blue-900/20" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <div className="flex items-center">
                <FaUser className="mr-2" />
                Profile
              </div>
            </button>
            <button
              className={`px-6 py-4 font-medium transition-all duration-300 ${
                activeTab === "security" 
                  ? "text-blue-400 border-b-2 border-blue-400 bg-blue-900/20" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <div className="flex items-center">
                <FaLock className="mr-2" />
                Security
              </div>
            </button>
          </div>
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <p className="text-gray-400 text-sm">You can update any field individually. Only the fields you change will be updated.</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-4 border-4 border-gray-700 transition-all duration-300 group-hover:border-blue-500/50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="text-4xl text-gray-500" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      <FaCamera size={14} />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-400 text-center">JPG, PNG or GIF. Max 5MB</p>
                  {fieldErrors.profileImage && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.profileImage}</p>
                  )}
                </div>
                
                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                            fieldErrors.name ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                      </div>
                      {fieldErrors.name && (
                        <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                            fieldErrors.email ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                      </div>
                      {fieldErrors.email && (
                        <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3 pointer-events-none">
                          <FaHome className="text-gray-400" />
                        </div>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                    >
                      {updateLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave size={14} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="p-6 md:p-8">
              <div className="max-w-md">
                <h3 className="text-xl font-medium mb-6 flex items-center">
                  <FaKey className="mr-2 text-blue-400" />
                  Change Password
                </h3>
                
                {!showPasswordFields ? (
                  <div className="bg-gray-700/30 rounded-lg p-6 text-center">
                    <p className="text-gray-300 mb-4">For security reasons, you should change your password regularly.</p>
                    <button
                      onClick={togglePasswordFields}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              fieldErrors.oldPassword ? 'border-red-500' : 'border-gray-600'
                            }`}
                          />
                        </div>
                        {fieldErrors.oldPassword && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.oldPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              fieldErrors.newPassword ? 'border-red-500' : 'border-gray-600'
                            }`}
                          />
                        </div>
                        {fieldErrors.newPassword && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.newPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                              fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                            }`}
                          />
                        </div>
                        {fieldErrors.confirmPassword && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={togglePasswordFields}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                      >
                        {updateLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaSave size={14} />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;