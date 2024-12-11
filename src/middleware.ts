import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if ((pathname.startsWith("/private") || pathname === "/") && !token) {
    return NextResponse.redirect(new URL("/public/signIn", request.url));
  }

  if ((pathname.startsWith("/public") || pathname === "/") && token) {
    return NextResponse.redirect(new URL("/private", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/private/:path*", "/public/:path*"], // Protect these routes
};
