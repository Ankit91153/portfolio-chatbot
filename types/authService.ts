export interface ILogin {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user?: any;
}
export interface IRegister{
    email:string
    user_id:string
}

export interface IVerifyOtp{
    email:string
    user_id:string
}

export interface IForgotPassword{
    email: string;
    user_id: string;
}

export interface IResetPassword{
    email?: string;
    message?: string;
}