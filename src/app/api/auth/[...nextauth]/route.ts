import NextAuth from "next-auth/next";
import { getAuthOptions } from "./options";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextRequest, res: NextResponse) => {
  let maxAge = 30 * 24 * 60 * 60;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET as string,
  });

  // If token exists and has expiration, calculate remaining time
  if (token && token.exp) {
    maxAge = token.exp - Math.floor(Date.now() / 1000);
  }

  // Override based on rememberMe flag
  if (token && "rememberMe" in token) {
    if (!token.rememberMe) {
      maxAge = Math.min(maxAge, 24 * 60 * 60);
    }
  }

  const authOptions = getAuthOptions(maxAge);

  return NextAuth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
    authOptions
  );
};

export { handler as GET, handler as POST };
