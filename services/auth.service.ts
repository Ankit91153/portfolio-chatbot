import api from "./api";
import { z } from "zod";
import { loginSchema, registerSchema, otpSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validators/auth";

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type OtpData = z.infer<typeof otpSchema>;

export const authService = {
    login: async (data: LoginData) => {
        // Mock API call
        console.log("Login data:", data);
        return new Promise<{ token: string; user: { name: string; email: string } }>((resolve) =>
            setTimeout(() => {
                const token = "dummy-jwt-token";
                document.cookie = `auth_token=${token}; path=/; max-age=86400`;
                resolve({ token: token, user: { name: "Test User", email: data.email } });
            }, 1000)
        );
    },
    register: async (data: RegisterData) => {
        console.log("Register data:", data);
        return new Promise<{ message: string }>((resolve) =>
            setTimeout(() => resolve({ message: "OTP sent successfully" }), 1000)
        );
    },
    verifyOtp: async (data: OtpData) => {
        console.log("OTP data:", data);
        return new Promise<{ token: string; user: { name: string } }>((resolve) =>
            setTimeout(() => {
                const token = "dummy-jwt-token";
                document.cookie = `auth_token=${token}; path=/; max-age=86400`;
                resolve({ token: token, user: { name: "Test User" } });
            }, 1000)
        );
    },
    forgotPassword: async (data: z.infer<typeof forgotPasswordSchema>) => {
        console.log("Forgot password:", data);
        return new Promise<{ message: string }>((resolve) =>
            setTimeout(() => resolve({ message: "Reset link/OTP sent" }), 1000)
        );
    },
    resetPassword: async (data: z.infer<typeof resetPasswordSchema>) => {
        console.log("Reset password:", data);
        return new Promise<{ message: string }>((resolve) =>
            setTimeout(() => resolve({ message: "Password reset successfully" }), 1000)
        );
    }
};
