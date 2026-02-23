import { AxiosRequestConfigWithRetry } from "@/lib/retry";
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Get access token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Handle multipart/form-data for file uploads
  if (config.url === "resume/parse_resume") {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config as AxiosRequestConfigWithRetry | undefined;

    console.log(error.response);

    if (!config?.__isRetryRequest) {
      let showError = "";

      const responseData = error.response?.data;

      if (responseData?.errors) {
        const errorMessages = Object.values(responseData.errors);
        showError = errorMessages.join("\n");

        toast.error(showError);
      } else if (responseData?.message) {
        showError = responseData.message;
        toast.error(showError);
      }
    }

    if (error.response?.status === 401) {
      // handle auth
    }

    return Promise.reject(error);
  },
);

export default api;
