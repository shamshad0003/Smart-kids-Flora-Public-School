import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    providers: [], // Added in auth.ts
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.mustChangePassword = (user as any).mustChangePassword;
            }
            if (trigger === "update" && session) {
                if (session.mustChangePassword !== undefined) {
                    token.mustChangePassword = session.mustChangePassword;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role as string;
                (session.user as any).mustChangePassword = token.mustChangePassword as boolean;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtectedRoute = nextUrl.pathname.startsWith("/admin") || 
                                    nextUrl.pathname.startsWith("/teacher") || 
                                    nextUrl.pathname.startsWith("/student") || 
                                    nextUrl.pathname.startsWith("/parent");
            
            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
