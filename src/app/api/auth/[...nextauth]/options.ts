import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmailServer } from "@api/user/utils";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

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
        if (user && (await compare(password, user.password))) {
          return user; // Authentication successful
        } else {
          return null; // Authentication failed
        }
      },
    }),
  ],
};
