"use client";

import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";

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
import { useRegisterStore } from "@/stores";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const setRegisterData = useRegisterStore((state) => state.setRegisterData);

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
           setRegisterData(response.email, response.user_id);

           console.log(response)

            router.push("/otp");
            toast.success("OTP sent on email")
          } catch (err: any) {
            console.log(err);
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

            <CardFooter className="mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
