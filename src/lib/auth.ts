import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Demo admin credentials - swap this check with a DB query in Phase 3
const DEMO_ADMIN = {
    id: "1",
    name: "Admin",
    email: "admin@florapublic.edu",
    role: "admin",
};

const DEMO_PASSWORD = "Admin@123";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                // Phase 3: Replace this block with a real DB lookup
                if (
                    email === DEMO_ADMIN.email &&
                    password === DEMO_PASSWORD
                ) {
                    return DEMO_ADMIN;
                }

                return null; // Return null = invalid credentials
            },
        }),
    ],
    pages: {
        signIn: "/login", // Redirect here when unauthenticated
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as typeof DEMO_ADMIN).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as typeof session.user & { role: string }).role =
                    token.role as string;
            }
            return session;
        },
    },
});
