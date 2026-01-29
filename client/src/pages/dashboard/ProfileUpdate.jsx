import { useState, useEffect } from "react";
import { updateProfileApi, getProfileApi } from "../../api/auth.api";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    oldPassword: "",
    dob: "",
    phone: "",
  });
  
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch current profile to pre-fill the form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        setFormData(res.data);
        setOriginalData(res.data);
      } catch (err) {
        console.log("Error fetching profile:", err.response?.data);
        setError("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  // Check if form has changes
  useEffect(() => {
    const hasFormChanges = Object.keys(formData).some(key => {
      if (key === 'password' || key === 'oldPassword') {
        return formData[key] !== "";
      }
      return formData[key] !== originalData[key];
    });
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

  // Get only the changed fields
  const getChangedFields = () => {
    const changedFields = {};
    
    Object.keys(formData).forEach(key => {
      if (key === 'password' || key === 'oldPassword') {
        // Only include password fields if they have values
        if (formData[key] !== "") {
          changedFields[key] = formData[key];
        }
      } else if (formData[key] !== originalData[key]) {
        // Include other fields only if they've changed
        changedFields[key] = formData[key];
      }
    });
    
    return changedFields;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const changedFields = getChangedFields();
    
    // Only validate fields that are being updated
    if (changedFields.hasOwnProperty('name') && !changedFields.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (changedFields.hasOwnProperty('email')) {
      if (!changedFields.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changedFields.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    if (changedFields.hasOwnProperty('phone')) {
      if (!changedFields.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^(01[3-9]\d{8})$/.test(changedFields.phone)) {
        errors.phone = "Please enter a valid Bangladeshi phone number";
      }
    }
    
    if (changedFields.hasOwnProperty('password') && !changedFields.oldPassword) {
      errors.oldPassword = "Old password is required to set a new password";
    }
    
    if (changedFields.hasOwnProperty('password') && changedFields.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }
    
    // Get only the fields that have changed
    const changedFields = getChangedFields();
    
    // If no fields have changed, don't make the API call
    if (Object.keys(changedFields).length === 0) {
      setError("No changes to update");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await updateProfileApi(changedFields);
      console.log("Profile updated:", res.data);
      setSuccess("Profile updated successfully!");
      
      // Update originalData with the successfully changed fields
      const updatedOriginalData = { ...originalData };
      Object.keys(changedFields).forEach(key => {
        updatedOriginalData[key] = formData[key];
      });
      setOriginalData(updatedOriginalData);
      
      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: "",
        oldPassword: ""
      });
    } catch (err) {
      console.error("Update error:", err.response?.data);
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  return (
    <div className=" mx-4 p-6 bg-white rounded-2xl shadow-xl mt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Update Profile</h2>
        <p className="text-gray-600 text-center mt-2">Manage your personal information</p>
      </div>
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
          <FaCheckCircle className="mr-2" />
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <FaExclamationCircle className="mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  fieldErrors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  fieldErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  fieldErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Address Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
          <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    fieldErrors.oldPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleOldPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.oldPassword && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.oldPassword}</p>
              )}
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    fieldErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !hasChanges}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              hasChanges
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;