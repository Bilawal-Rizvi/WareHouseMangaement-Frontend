import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ================= Axios Instance =================
const apiInstance = axios.create({ baseURL: API_BASE_URL });

// ================= Token Refresh Queue =================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// ================= Set Access Token =================
export const setAuthToken = (token) => {
  if (token) {
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete apiInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
  }
};

// ================= Axios Interceptor =================
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return apiInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        setAuthToken(null);
        return Promise.reject(error);
      }

      try {
        const { data } = await apiInstance.post("/auth/refresh-token", { token: refreshToken });
        const newAccessToken = data.accessToken;
        setAuthToken(newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return apiInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        setAuthToken(null);
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// ================= Generic API Service =================
export const apiService = {
  getAll: (tableName) => apiInstance.get(`/${tableName}`),
  getById: (tableName, id) => apiInstance.get(`/${tableName}/${id}`),
  create: (tableName, data) => apiInstance.post(`/${tableName}`, data),
  update: (tableName, id, data) => apiInstance.put(`/${tableName}/${id}`, data),
  delete: (tableName, id) => apiInstance.delete(`/${tableName}/${id}`),
  search: (tableName, query) => apiInstance.get(`/${tableName}/search`, { params: { q: query } }),
};

// ================= Auth Service =================
export const authService = {
  login: async (email, password) => {
    const { data } = await apiInstance.post("/auth/login", { email, password });

    // Save tokens
    setAuthToken(data.accessToken); // for axios headers & localStorage
    localStorage.setItem("refreshToken", data.refreshToken);

    return data.user;
  },

  signup: async (name, email, password) => {
    const { data } = await apiInstance.post("/auth/register", { name, email, password });
    return data;
  },

  logout: () => {
    setAuthToken(null);
    localStorage.removeItem("refreshToken");
  },
};

// ================= Initialize existing token =================
const existingToken = localStorage.getItem("accessToken");
if (existingToken) setAuthToken(existingToken);
