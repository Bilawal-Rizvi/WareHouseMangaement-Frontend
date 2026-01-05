import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Helper: set or remove token
export const setAuthToken = (token) => {
  if (token) {
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token); // persist token
  } else {
    delete apiInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Helper: get token from localStorage
const getToken = () => localStorage.getItem("token");

// Centralized request handler
const request = async (method, url, data = null, params = null) => {
  try {
    const token = getToken();
    if (token) setAuthToken(token);

    const response = await apiInstance({
      method,
      url,
      data,
      params,
    });

    return response.data;
  } catch (error) {
    // If token expired or unauthorized, remove it
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    console.error("API error:", error.response?.data || error.message);
    throw error;
  }
};

// Generic API service
export const apiService = {
  getAll: (tableName) => request("get", `/${tableName}`),
  getById: (tableName, id) => request("get", `/${tableName}/${id}`),
  create: (tableName, data) => request("post", `/${tableName}`, data),
  update: (tableName, id, data) => request("put", `/${tableName}/${id}`, data),
  delete: (tableName, id) => request("delete", `/${tableName}/${id}`),
  search: (tableName, searchTerm) =>
    request("get", `/${tableName}/search`, null, { q: searchTerm }),
};

// Auth service
export const authService = {
  login: async (email, password) => {
    const data = await request("post", "/auth/login", { email, password });
    setAuthToken(data.token); // set token for all future requests
    return data;
  },

  signup: async (name, email, password) => {
    return await request("post", "/auth/register", { name, email, password });
    // do NOT auto-login after signup
  },

  logout: () => setAuthToken(null), // clear token
};
