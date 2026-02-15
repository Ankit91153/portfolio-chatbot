import * as Yup from "yup";

export const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email address"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = Yup.object({
    full_name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
  
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

export const otpSchema = Yup.object({
    otp: Yup.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = Yup.object({
    email: Yup.string().email("Invalid email address"),
});

export const resetPasswordSchema = Yup.object({
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string().min(6, "Password must be at least 6 characters"),
}).test(
    "passwords-match",
    "Passwords do not match",
    function (value) {
      return value?.password === value?.confirmPassword;
    }
  );
