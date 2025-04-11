import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/prisma";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    async signIn({ account, user }) {
      if (account && account.provider === "google") {
        const dbUser = await prisma.userTenant.findFirst({
          where: {
            email: user.email!,
          },
        });

        if (dbUser) {
          return dbUser.isActive;
        }
      }

      await prisma.loginAttempts.create({
        data: {
          email: user.email!,
        },
      });

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        let role = user.role;
        let tenantId = user.tenantId;
        let userId = user.userId;

        if (!tenantId || !userId || !role) {
          const dbUser = await prisma.userTenant.findFirst({
            where: {
              email: user.email!,
            },
          });

          if (!dbUser) {
            throw new Error("User not found");
          }

          await prisma.user.update({
            where: {
              email: user.email!,
            },
            data: {
              tenant: {
                connect: {
                  id: dbUser.tenantId,
                },
              },
              userTenant: {
                connect: {
                  id: dbUser.id,
                },
              },
            },
            include: {
              tenant: true,
            },
          });

          role = dbUser.role || UserRole.USER;
          tenantId = dbUser.tenantId;
          userId = dbUser.id;
        }

        token.userId = userId || "";
        token.role = role;
        token.tenantId = tenantId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
        session.user.userId = token.userId;
      }
      return session;
    },
  },
  pages: {
    error: "/home",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
