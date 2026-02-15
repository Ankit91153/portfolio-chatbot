"use client";

import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
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
import { resetPasswordSchema } from "@/lib/validators/auth"; // Yup schema
import { authService } from "@/services/auth.service";
import { toast } from "sonner"; // optional for notifications

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>

      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={resetPasswordSchema}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await authService.resetPassword(values);
            toast.success("Password reset successfully!");
            router.push("/login");
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
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="******"
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

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
