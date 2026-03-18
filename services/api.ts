import { AxiosRequestConfigWithRetry } from "@/lib/retry";
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

// Extend AxiosRequestConfig to track retry state
interface AxiosRequestConfigWithRefresh extends AxiosRequestConfigWithRetry {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response Interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRefresh;

    // ── 401 → try refresh token ──────────────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loop

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refresh_token")
          : null;

      if (refreshToken) {
        try {
          // Call refresh endpoint directly with axios (not api) to avoid interceptor loop
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refresh_token: refreshToken },
          );

          const { access_token, refresh_token: new_refresh_token } =
            refreshResponse.data?.data ?? refreshResponse.data;

          // ── Update localStorage ──────────────────────────────────────────
          localStorage.setItem("access_token", access_token);
          if (new_refresh_token) {
            localStorage.setItem("refresh_token", new_refresh_token);
          }

          // ── Update Zustand store ─────────────────────────────────────────
          // Lazy import to avoid circular dependency
          const { useAuthStore } = await import("@/stores/authSlice");
          useAuthStore
            .getState()
            .setTokens(access_token, new_refresh_token ?? refreshToken);

          // ── Retry original request with new token ────────────────────────
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed → logout user
          const { useAuthStore } = await import("@/stores/authSlice");
          useAuthStore.getState().logout();

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token → logout
        const { useAuthStore } = await import("@/stores/authSlice");
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    // ── Non-401 errors → show toast (skip retry requests) ───────────────────
    const config = error.config as AxiosRequestConfigWithRetry | undefined;

    if (!config?.__isRetryRequest) {
      const responseData = error.response?.data;
      if (responseData?.message) {
        toast.error(responseData.message);
      } else if (responseData?.errors) {
        const errorMessages = Object.values(
          responseData.errors as Record<string, string>,
        );
        toast.error(errorMessages.join("\n"));
      } else if (responseData?.detail) {
        toast.error(responseData.detail);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
