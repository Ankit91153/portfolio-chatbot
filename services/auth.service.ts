import api from "./api";
import {
  IApiBaseResponse
} from "@/types/api";
import {
  IForgotPassword,
  ILogin,
  IRegister,
  IResetPassword,
  IVerifyOtp,
} from "@/types/authService";
import { retry } from "@/lib/retry";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export interface OtpData {
  otp_code: string;
  email:string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp_code: string;
  new_password: string;
}

export const authService = {
  login: async (data: LoginData): Promise<IApiBaseResponse<ILogin>> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },
  register: async (
    data: RegisterData,
  ): Promise<IApiBaseResponse<IRegister>> => {
    const payload = { fullName: data.full_name, email: data.email, password: data.password };
    const response = await api.post("/api/auth/signup", payload);
    return response.data;
  },
  verifyOtp: async (data: OtpData): Promise<IApiBaseResponse<IVerifyOtp>> => {
    const payload = { email: data.email, otp: data.otp_code };
    return retry((config) =>
      api.post("/api/auth/verify-otp", payload, config).then((res) => res.data),
    );
  },
  forgotPassword: async (
    data: ForgotPasswordData,
  ): Promise<IApiBaseResponse<IForgotPassword>> => {
    console.log(data);
    const response = await api.post<IApiBaseResponse<IForgotPassword>>(
      "/api/auth/forgot-password",
      data
    );
    return response.data;
  },
  resetPassword: async (
    data: ResetPasswordData,
  ): Promise<IApiBaseResponse<IResetPassword>> => {
    const payload = { email: data.email, otp: data.otp_code, newPassword: data.new_password };
    const response = await api.post("/api/auth/reset-password", payload);
    return response.data;
  },
};
