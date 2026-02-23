"use client";

import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { useRegisterStore } from "@/stores";
import { useEffect } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { email ,clearRegisterData} = useRegisterStore();

  // Redirect if no email (user didn't come from forgot password flow)
  useEffect(() => {
    if (!email) {
      toast.error("Please request a password reset first");
      router.push("/forgot-password");
    }
  }, []);

  if (!email) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter the OTP sent to your email and create a new password
        </CardDescription>
        
        {/* Email Display */}
        <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-md">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{email}</span>
        </div>
      </CardHeader>

      <Formik
        initialValues={{
          otp: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={resetPasswordSchema}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Prepare data for backend
            const resetData = {
              email: email,
              otp_code: values.otp,
              new_password: values.password,
            };

            await authService.resetPassword(resetData);
            toast.success("Password reset successfully!");
            clearRegisterData()
            router.push("/login");
            console.log("RRRRRRRRRRRRRRRRR")
          } catch (err: any) {
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty }) => (
          <Form>
            <CardContent className="space-y-4">
              {/* OTP Field */}
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  name="otp"
                  maxLength={6}
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(touched.otp || values.otp) && errors.otp && (
                  <div className="text-red-500 text-xs">{errors.otp}</div>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(touched.password || values.password) && errors.password && (
                  <div className="text-red-500 text-xs">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(touched.confirmPassword || values.confirmPassword) &&
                  errors.confirmPassword && (
                    <div className="text-red-500 text-xs">{errors.confirmPassword}</div>
                  )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 mt-4">
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the OTP?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Request again
                </button>
              </div>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
