"use client";

import { useFormik } from "formik";
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
import { registerSchema } from "@/lib/validators/auth";
import { authService } from "@/services/auth.service";
import { useState } from "react";
import { z } from "zod";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validate: (values) => {
            try {
                registerSchema.parse(values);
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
                await authService.register(values);
                router.push("/otp");
            } catch (err) {
                setError("Something went wrong. Please try again.");
            }
        },
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={formik.handleSubmit}>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            {...formik.getFieldProps("name")}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500 text-xs">{formik.errors.name}</div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-xs">{formik.errors.email}</div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
                        {formik.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
