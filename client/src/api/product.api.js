import API from "./axios";

export const getProductsApi = () => API.get("/api/v1/product");
export const getProductByIdApi = (id) => API.get(`/api/v1/product/${id}`);