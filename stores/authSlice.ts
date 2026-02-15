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
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
