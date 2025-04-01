import NextAuth from "next-auth/next";
import { getAuthOptions } from "./options";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextRequest, res: NextResponse) => {
  let maxAge = 24 * 60 * 60;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET as string,
  });

  // Override maxAge based on rememberMe flag
  if (token) {
    maxAge = token.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
    const remaining = (token.exp as number) - Math.floor(Date.now() / 1000);
    maxAge = Math.min(maxAge, remaining);
  }
  
  const authOptions = getAuthOptions(maxAge);

  return NextAuth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
    authOptions
  );
};

export { handler as GET, handler as POST };
