import axios from "axios";
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_URL_BACK ? `${import.meta.env.VITE_URL_BACK}/api` : "/api");
let accessToken = null;
let isRefreshing = false;
let refreshPromise = null;
export function setAccessToken(token) {
  accessToken = token || null;
}
export function clearAccessToken() {
  accessToken = null;
}
export function getAccessToken() {
  return accessToken;
}
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
export const configHeaders = () => ({ headers: {} });
export const configHeadersImage = {
  headers: {
    "content-type": "multipart/form-data",
  },
};
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshClient.post("/auth/refresh", {});
        const { data } = await refreshPromise;
        setAccessToken(data?.token || null);
        isRefreshing = false;
      } else {
        await refreshPromise;
      }
      if (accessToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return api(originalRequest);
    } catch (e) {
      isRefreshing = false;
      setAccessToken(null);
      return Promise.reject(e);
    }
  }
);
export default api;
