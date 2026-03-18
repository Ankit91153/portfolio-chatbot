import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProfileState } from "./types";

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      fullName: null,
      email: null,
      chatId: null,
      chatName: null,
      chatContent: null,
      loading: false,
      error: null,

      setUserProfile: ({ fullName, email, chatId, chatName, chatContent }) =>
        set({ fullName, email, chatId, chatName, chatContent, error: null }),

      updateChatContent: (content) => set({ chatContent: content }),

      updateChatMeta: (chatId, chatName) => set({ chatId, chatName }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearProfile: () =>
        set({
          fullName: null,
          email: null,
          chatId: null,
          chatName: null,
          chatContent: null,
          loading: false,
          error: null,
        }),
    }),
    {
      name: "profile-storage",
      partialize: (state) => ({
        fullName: state.fullName,
        email: state.email,
        chatId: state.chatId,
        chatName: state.chatName,
        chatContent: state.chatContent,
      }),
    }
  )
);
