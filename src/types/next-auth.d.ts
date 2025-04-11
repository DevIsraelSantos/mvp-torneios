import { UserRole } from "@prisma/client";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: UserRole;
    userId?: string;
    tenantId?: string;
    email: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultUser {
    role: UserRole;
    tenantId: string;
    userId: string;
    email: string;
  }
}
