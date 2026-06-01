import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// Global error interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    let message = err.response?.data?.detail || "Something went wrong";
    
    // Format FastAPI validation errors (which are arrays) into a readable string
    if (Array.isArray(message)) {
      message = message.map(m => {
        const field = m.loc && m.loc.length > 1 ? m.loc[m.loc.length - 1] : "Field";
        return `${field}: ${m.msg}`;
      }).join(" | ");
    } else if (typeof message === "object") {
      message = JSON.stringify(message);
    }
    
    return Promise.reject(new Error(message));
  },
);

export default api;
