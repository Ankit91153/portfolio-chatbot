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
        // Store in Zustand state
        set({ accessToken, refreshToken });
        
      },
      logout: () => {
        // Clear Zustand state
        set({ user: null, accessToken: null, refreshToken: null });
        
        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_type");
          localStorage.removeItem("token");
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
