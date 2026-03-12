import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isLoginPage = nextUrl.pathname === "/login";

    // Redirect logged-in users away from the login page to dashboard
    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL("/admin", nextUrl));
    }

    // Redirect unauthenticated users trying to access admin routes
    if (!isLoggedIn && isAdminRoute) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    // Skip Next.js internals and static files
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    ],
};
