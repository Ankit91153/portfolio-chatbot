export function Footer() {
    return (
        <footer className="border-t py-6 md:py-3">
            <div className="container flex flex-col items-center justify-between gap-4">
                <p className="text-center text-sm leading-loose text-muted-foreground">
                    &copy; {new Date().getFullYear()} Portfolio Chatbot. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
