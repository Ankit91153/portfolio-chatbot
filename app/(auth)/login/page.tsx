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
import { loginSchema } from "@/lib/validators/auth";
import { authService } from "@/services/auth.service";
import { toast } from "sonner"; // Optional: toast library

export default function LoginPage() {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await authService.login(values);
            router.push("/profile");
          } catch (err: any) {
            console.log(err)
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty }) => (
          <Form>
            <CardContent className="space-y-4">
              {/* Email */}
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

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(touched.password || values.password) && errors.password && (
                  <div className="text-red-500 text-xs">{errors.password}</div>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground underline hover:text-primary"
                >
                  Forgot your password?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 mt-5">
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
