import axios from "axios";

// Create a reusable Axios instance for communicating with the backend API
const instance = axios.create({
  // Base URL for all API requests
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the JWT token to every outgoing request
instance.interceptors.request.use(
  (config) => {
    // Retrieve the access token from localStorage
    const token = localStorage.getItem("token");

    // If a token exists, include it in the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Forward any request configuration errors
    return Promise.reject(error);
  }
);

export default instance;