"use client";

import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { authService } from "@/services/auth.service";
import { toast } from "sonner"; // optional for error notifications
import { useRegisterStore } from "@/stores";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const setRegisterData = useRegisterStore((state) => state.setRegisterData);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset code
        </CardDescription>
      </CardHeader>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordSchema}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
           const response= await authService.forgotPassword(values);
            setRegisterData(response?.data?.email, response?.data?.user_id);
            toast.success("OTP sent to your email!");
            router.push("/reset-password");
          } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || err?.response?.data?.message || "Failed to send OTP";
            toast.error(errorMessage);
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty }) => (
          <Form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(touched.email || values.email) && errors.email && (
                  <div className="text-red-500 text-xs">{errors.email}</div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 mt-5">
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Login
                </Link>
              </div>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
