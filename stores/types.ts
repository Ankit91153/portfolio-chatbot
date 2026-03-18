import { ProfileContent } from "@/types/profile";

export interface AuthState {
    user: any | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: any) => void;
    setTokens: (accessToken: string, refreshToken?: string) => void;
    logout: () => void;
}

export interface RegisterState {
    email: string | null;
    userId: string | null;
    setRegisterData: (email: string, userId: string) => void;
    clearRegisterData: () => void;
}

export interface ProfileState {
    // user identity
    fullName: string | null;
    email: string | null;
    // chat meta
    chatId: string | null;
    chatName: string | null;
    // profile content
    chatContent: ProfileContent | null;
    // loading / error
    loading: boolean;
    error: string | null;
    // actions
    setUserProfile: (data: {
        fullName: string;
        email: string;
        chatId: string;
        chatName: string;
        chatContent: ProfileContent;
    }) => void;
    updateChatContent: (content: ProfileContent) => void;
    updateChatMeta: (chatId: string, chatName: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearProfile: () => void;
}