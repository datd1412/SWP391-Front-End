import axios from "axios";
const baseUrl = "http://14.225.204.58:8080/api/";


// const baseUrl = "http://68.183.180.21:8080";
//
const config = {
  baseUrl,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;
const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};
const handleError = (error) => {
  console.log(error);
  return;
};
api.interceptors.request.use(handleBefore, handleError);
// api.interceptors.response.use(null, handleError);

export default api;
