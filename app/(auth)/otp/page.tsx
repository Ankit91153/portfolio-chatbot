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
import { otpSchema } from "@/lib/validators/auth"; // Yup schema
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { useRegisterStore } from "@/stores/registerSlice";

export default function OtpPage() {
  const router = useRouter();
  const { email, userId, clearRegisterData } = useRegisterStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Verify OTP</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email
          {email && (
            <span className="block mt-1 text-sm text-muted-foreground">
              OTP sent to: <strong>{email}</strong>
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpSchema}
        validateOnChange
        validateOnBlur
        validateOnMount
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // send email + userId + otp to backend
            await authService.verifyOtp({ email, userId, otp: values.otp });
            toast.success("OTP verified!");
            clearRegisterData(); 
            router.push("/login");
          } catch (err: any) {
            console.log(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid, dirty }) => (
          <Form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className="tracking-widest"
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(touched.otp || values.otp) && errors.otp && (
                  <div className="text-red-500 text-xs">{errors.otp}</div>
                )}
              </div>
            </CardContent>

            <CardFooter className="mt-5">
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
