import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const user = req.auth?.user as { role?: string; mustChangePassword?: boolean } | null;
    const role = user?.role;

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isTeacherRoute = nextUrl.pathname.startsWith("/teacher");
    const isStudentRoute = nextUrl.pathname.startsWith("/student");
    const isParentRoute = nextUrl.pathname.startsWith("/parent");
    const isLoginPage = nextUrl.pathname === "/login";

    const isProtectedRoute = isAdminRoute || isTeacherRoute || isStudentRoute || isParentRoute;
    const mustChangePassword = user?.mustChangePassword;

    // 1. Force Password Change Redirection
    if (isLoggedIn && mustChangePassword && nextUrl.pathname !== "/change-password" && !nextUrl.pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL("/change-password", nextUrl));
    }

    // 2. Redirect logged-in users away from the login page to their dashboard
    if (isLoggedIn && isLoginPage) {
        const dashboardMap: Record<string, string> = {
            ADMIN: "/admin",
            TEACHER: "/teacher",
            STUDENT: "/student",
            PARENT: "/parent",
        };
        const redirect = dashboardMap[role ?? ""] ?? "/login";
        return NextResponse.redirect(new URL(redirect, nextUrl));
    }

    // 3. Redirect unauthenticated users
    if (!isLoggedIn && isProtectedRoute) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Role-based access control
    if (isLoggedIn && isProtectedRoute) {
        const allowed =
            (isAdminRoute && role === "ADMIN") ||
            (isTeacherRoute && role === "TEACHER") ||
            (isStudentRoute && role === "STUDENT") ||
            (isParentRoute && role === "PARENT");

        if (!allowed) {
            const dashboardMap: Record<string, string> = {
                ADMIN: "/admin",
                TEACHER: "/teacher",
                STUDENT: "/student",
                PARENT: "/parent",
            };
            const fallback = dashboardMap[role ?? ""] ?? "/login";
            return NextResponse.redirect(new URL(fallback, nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    ],
};
