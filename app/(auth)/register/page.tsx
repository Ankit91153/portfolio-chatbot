"use client";

import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

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
import { Button } from "@/components/ui/button";

import { registerSchema } from "@/lib/validators/auth";
import { authService } from "@/services/auth.service";
import { useRegisterStore, useAuthStore } from "@/stores";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const setRegisterData = useRegisterStore((state) => state.setRegisterData);
  const { accessToken } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (accessToken || (typeof window !== "undefined" && localStorage.getItem("access_token"))) {
      router.push("/profile");
    }
  }, [accessToken, router]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <Formik
        initialValues={{
            full_name: "",
          email: "",
          password: "",
        }}
        validationSchema={registerSchema}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
           const response= await authService.register(values);
           setRegisterData(response?.data?.email, response?.data?.user_id);
            router.push("/otp");
            toast.success("OTP sent on email")
          } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || err?.response?.data?.message || "Registration failed";
            toast.error(errorMessage);
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          getFieldProps,
          errors,
          touched,
          values,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <Form>
            <CardContent className="space-y-4">

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  {...getFieldProps("full_name")}
                />
                {(touched.full_name || values.full_name) && errors.full_name && (
                  <div className="text-red-500 text-xs">
                    {errors.full_name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...getFieldProps("email")}
                />
                {(touched.email || values.email) && errors.email && (
                  <div className="text-red-500 text-xs">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  {...getFieldProps("password")}
                />
                {(touched.password || values.password) && errors.password && (
                  <div className="text-red-500 text-xs">
                    {errors.password}
                  </div>
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
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
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
