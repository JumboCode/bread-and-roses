import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmailServer } from "@api/user/utils";
import { compare } from "bcryptjs";
import { User, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAuthOptions = (dynamicMaxAge?: number): NextAuthOptions => {
  return {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email:",
            type: "text",
            placeholder: "your-email",
          },
          password: {
            label: "Password:",
            type: "password",
            placeholder: "your-password",
          },
          remember: {
            label: "Remember me",
            type: "checkbox",
          },
        },
        async authorize(credentials) {
          // Your existing authorize function remains the same
          if (!credentials) {
            return null;
          }
          const { email, password, remember } = credentials;
          const rememberMe = remember === "on";
          const user: User | null = await getUserByEmailServer(email);

          if (!user) {
            throw new Error("Invalid user");
          }

          if (!(await compare(password, user.password))) {
            throw new Error("Invalid password");
          }

          let volunteerDetails = null;
          if (user.role !== "ADMIN") {
            volunteerDetails = await prisma.volunteerDetails.findUnique({
              where: { userId: user.id },
            });
          }

          return {
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            volunteerDetails,
            rememberMe: rememberMe,
            organizationId: user.organizationId,
          };
        },
      }),
    ],
    pages: {
      signIn: "/public/signIn",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.rememberMe = user.rememberMe;
          token.organizationId = user.organizationId;

          if (user.role !== "ADMIN") {
            token.volunteerDetails = user.volunteerDetails || null;
          }
        }

        token.expiresIn = token.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
        token.exp = token.iat + (dynamicMaxAge ?? 24 * 60 * 60);

        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;

            if (dbUser.role !== "ADMIN") {
              const volunteerDetails = await prisma.volunteerDetails.findUnique(
                {
                  where: { userId: dbUser.id },
                }
              );
              token.volunteerDetails = volunteerDetails || null;
            } else {
              token.volunteerDetails = null;
            }
          }
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.volunteerDetails = token.volunteerDetails || null;
        session.user.organizationId = token.organizationId;
        session.expires = new Date(token.exp * 1000).toISOString();
        return session;
      },
    },
    session: {
      strategy: "jwt",
      updateAge: 600,
      maxAge: dynamicMaxAge || 24 * 60 * 60, // Use the dynamic maxAge if provided, otherwise use 1 day
    },
  };
};

export const options = getAuthOptions();
