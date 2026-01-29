import API from "./axios";

export const getMyCorseApi = ({ page = 1, limit = 10, type = "course" }) => {
  return API.get("api/v1/my-orders", {
    params: { page, limit, type },
    withCredentials: true 
  });
};


export const getMyOrderApi = ({ page = 1, limit = 10, type = "product" }) => {
  return API.get("api/v1/my-orders", {
    params: { page, limit, type },
    withCredentials: true 
  });
};