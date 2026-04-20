import { DefaultSession } from "next-auth";
// import { JWT } from "next-auth/jwt"; // Unused but kept for reference if needed, commenting out for lint

declare module "next-auth" {
  interface User {
    role?: string;
    mustChangePassword?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    mustChangePassword?: boolean;
  }
}
