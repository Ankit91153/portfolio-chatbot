"use client";

import { useFormik } from "formik";
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
import { otpSchema } from "@/lib/validators/auth";
import { authService } from "@/services/auth.service";
import { useState } from "react";
import { z } from "zod";

export default function OtpPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            otp: "",
        },
        validate: (values) => {
            try {
                otpSchema.parse(values);
                return {};
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return error.issues.reduce((acc: Record<string, string>, curr) => {
                        const key = curr.path[0] as string;
                        acc[key] = curr.message;
                        return acc;
                    }, {} as Record<string, string>);
                }
                return {};
            }
        },
        onSubmit: async (values) => {
            setError(null);
            try {
                await authService.verifyOtp(values);
                router.push("/dashboard");
            } catch (err) {
                setError("Invalid OTP. Please try again.");
            }
        },
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Verify OTP</CardTitle>
                <CardDescription>
                    Enter the 6-digit code sent to your email
                </CardDescription>
            </CardHeader>
            <form onSubmit={formik.handleSubmit}>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="otp">One-Time Password</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            className="tracking-widest"
                            {...formik.getFieldProps("otp")}
                        />
                        {formik.touched.otp && formik.errors.otp && (
                            <div className="text-red-500 text-xs">{formik.errors.otp}</div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
                        {formik.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
