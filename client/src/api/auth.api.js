import API from "./axios";

export const loginApi = (data) => API.post("/api/v1/user/auth/login", data,{withCredentials:true});
export const logoutAPI = () => API.get("/api/v1/user/auth/logout",{withCredentials:true});
export const signupApi = (data) => API.post("/api/v1/user/auth/register", data);
// Profile APIs
export const updateProfileApi = (data) => { 
  return API.put("/api/v1/user/profile/update", data, {
    headers: { "Content-Type": 'multipart/form-data' }, 
    withCredentials:true
  });
};

// Optional: get current user profile
export const getProfileApi = () => {
  return API.get("/api/v1/user/profile", {
    withCredentials:true
  });
};