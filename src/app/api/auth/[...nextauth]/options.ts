import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmailServer } from "@api/user/utils";
import { compare } from "bcryptjs";
import { User, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
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
      },
      async authorize(credentials) {
        if (!credentials) {
          return null; // or throw an error
        }
        const { email, password } = credentials;
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials

        const user: User | null = await getUserByEmailServer(email);

        // Check if user exists and if password matches
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

        if (user.role !== "ADMIN") {
          token.volunteerDetails = user.volunteerDetails || null;
        }
      }

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
            const volunteerDetails = await prisma.volunteerDetails.findUnique({
              where: { userId: dbUser.id },
            });
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
      return session;
    },
  },
};
