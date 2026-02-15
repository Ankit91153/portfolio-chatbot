import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RegisterState } from "./types";


export const useRegisterStore = create<RegisterState>()(
    persist(
        (set) => ({
            email: null,
            userId: null,
            setRegisterData: (email, userId) => set({ email, userId }),
            clearRegisterData: () => set({ email: null, userId: null }),
        }),
        {
            name: "register-storage", // localStorage key
            partialize: (state) => ({ email: state.email, userId: state.userId }),
        }
    )
);
