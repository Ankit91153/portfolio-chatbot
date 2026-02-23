export interface AuthState {
    user: any | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: any) => void;
    setTokens: (accessToken: string, refreshToken?: string) => void;
    logout: () => void;
  }


 export  interface RegisterState {
    email: string | null;
    userId: string | null;
    setRegisterData: (email: string, userId: string) => void;
    clearRegisterData: () => void;
  }