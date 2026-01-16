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
import { resetPasswordSchema } from "@/lib/validators/auth";
import { authService } from "@/services/auth.service";
import { useState } from "react";
import { z } from "zod";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: (values) => {
            try {
                resetPasswordSchema.parse(values);
                return {};
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return error.issues.reduce((acc: Record<string, string>, curr) => {
                        const key = curr.path[0] as string;
                        // Handle cross-field validation specifically if path is at root or elsewhere
                        if (key === "confirmPassword" || curr.code === "custom") {
                            acc["confirmPassword"] = curr.message;
                        } else {
                            acc[key] = curr.message;
                        }
                        return acc;
                    }, {} as Record<string, string>);
                }
                return {};
            }
        },
        onSubmit: async (values) => {
            setError(null);
            try {
                await authService.resetPassword(values);
                router.push("/login");
            } catch (err) {
                setError("Failed to reset password.");
            }
        },
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <form onSubmit={formik.handleSubmit}>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="******"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-xs">{formik.errors.password}</div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="******"
                            {...formik.getFieldProps("confirmPassword")}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
                        {formik.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
