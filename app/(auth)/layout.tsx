import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 relative">
            <div className="absolute top-4 left-4">
                <Link href="/">
                    <Button variant="ghost" className="gap-2">
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
