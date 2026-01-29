import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-e-learning.apaybd.com/", 
});

export default API;
