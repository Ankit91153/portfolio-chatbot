"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    if (isAuthPage) return null; // Optionally hide navbar on auth pages

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary" />
                        <span>PortfolioBot</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-4">
                    <Link href="/services" className="text-sm font-medium hover:underline underline-offset-4">
                        Services
                    </Link>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Create Account</Link>
                        </Button>
                    </div>
                </nav>

                {/* Mobile Nav */}
                <div className="flex md:hidden items-center gap-2">
                    <ModeToggle />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-semibold">
                                    Home
                                </Link>
                                <Link href="/services" onClick={() => setIsOpen(false)} className="text-lg font-semibold">
                                    Services
                                </Link>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild onClick={() => setIsOpen(false)}>
                                        <Link href="/register">Create Account</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
