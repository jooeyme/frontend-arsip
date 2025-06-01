import axios from "axios";

// Set up Axios instance
// production || develop
// const baseURL = import.meta.env.VITE_API_URL;

const baseURL = 'http://localhost:3000/api'

const instance = axios.create({ baseURL });
// Add interceptor to automatically add authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
 }, (error) => {
  return Promise.reject(error);
});

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("token"); // hapus token
//       window.location.href = "/signin"; // redirect ke login
//     }

//     return Promise.reject(error); // lempar error ke pemanggil
//   }
// );

export { instance };