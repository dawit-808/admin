import axios from "axios";

const BASE_URL = " http://localhost:5000/api";

// refresh instance (NO interceptors)
const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// main api instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// interceptors will be attached later dynamically
let getToken = null;

export const injectTokenGetter = (fn) => {
  getToken = fn;
};

// request interceptor
api.interceptors.request.use((config) => {
  const token = getToken?.();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// refresh control
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedQueue = [];
};

// response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshApi.post("/auth/refresh");
        const newToken = res.data.accessToken;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
