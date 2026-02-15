import api from "./api";
import { z } from "zod";
import { loginSchema, registerSchema, otpSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validators/auth";
import { IApiBaseResponse } from "@/types/api";
import { IForgotPassword, ILogin, IRegister, IResetPassword, IVerifyOtp } from "@/types/authService";
import { retry } from "@/lib/retry";

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type OtpData = z.infer<typeof otpSchema>;

export const authService = {
    login: async (data: LoginData):Promise<IApiBaseResponse<ILogin>> => {
        const response =await api.post("/auth/login",data)
        return response.data
    },
    register: async (data: RegisterData):Promise<IApiBaseResponse<IRegister>> => {
        const response =await api.post("/auth/signup",data)
        console.log(response)
        return response.data
    },
    verifyOtp: async (data: OtpData):Promise<IApiBaseResponse<IVerifyOtp>> => {
        return retry((config)=> api.post("/otp/verify",data,config).then((res)=>res.data))
        
    },
    forgotPassword: async (data: z.infer<typeof forgotPasswordSchema>):Promise<IApiBaseResponse<IForgotPassword>> => {
        const response =await api.post("/password/forgot",data)
        return response
    },
    resetPassword: async (data: z.infer<typeof resetPasswordSchema>):Promise<IApiBaseResponse<IResetPassword>> => {
        const response =await api.post("/password/reset",data)
        return response
    }
};
