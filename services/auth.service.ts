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
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  register: async (
    data: RegisterData,
  ): Promise<IApiBaseResponse<IRegister>> => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },
  verifyOtp: async (data: OtpData): Promise<IApiBaseResponse<IVerifyOtp>> => {
    return retry((config) =>
      api.post("/otp/verify", data, config).then((res) => res.data),
    );
  },
  forgotPassword: async (
    data: ForgotPasswordData,
  ): Promise<IApiBaseResponse<IForgotPassword>> => {
    console.log(data);
    const response = await api.post<IApiBaseResponse<IForgotPassword>>(
      "/password/forget",
      null, // empty body
      {
        params: {
          email: data.email,
        },
      },
    );
    return response.data;
  },
  resetPassword: async (
    data: ResetPasswordData,
  ): Promise<IApiBaseResponse<IResetPassword>> => {
    const response = await api.post("/password/reset", data);
    return response.data;
  },
};
