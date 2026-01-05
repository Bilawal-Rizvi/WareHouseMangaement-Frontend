import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiInstance = axios.create({ baseURL: API_BASE_URL });

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Set token in headers
export const setAuthToken = (token) => {
  if (token) {
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete apiInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
  }
};

apiInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { token: refreshToken });
        setAuthToken(data.accessToken);
        originalRequest.headers["Authorization"] = "Bearer " + data.accessToken;
        processQueue(null, data.accessToken);
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        setAuthToken(null);
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export const apiService = {
  getAll: (tableName) => apiInstance.get(`/${tableName}`),
  create: (tableName, data) => apiInstance.post(`/${tableName}`, data),
  update: (tableName, id, data) => apiInstance.put(`/${tableName}/${id}`, data),
  delete: (tableName, id) => apiInstance.delete(`/${tableName}/${id}`),
};

export const authService = {
  login: async (email, password) => {
    const { data } = await apiInstance.post("/auth/login", { email, password });
    setAuthToken(data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  },
  signup: async (name, email, password) => await apiInstance.post("/auth/register", { name, email, password }),
  logout: () => {
    setAuthToken(null);
    localStorage.removeItem("refreshToken");
  },
};
