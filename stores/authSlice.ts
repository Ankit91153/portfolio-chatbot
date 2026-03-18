import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "./types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => {
        // Update Zustand state
        set({ accessToken, refreshToken });

        // Keep localStorage in sync
        if (typeof window !== "undefined") {
          if (accessToken) localStorage.setItem("access_token", accessToken);
          if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        }
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });

        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_type");
          // Clear profile store too
          localStorage.removeItem("profile-storage");
          localStorage.removeItem("auth-storage");
          
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
