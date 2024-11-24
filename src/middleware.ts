import { withAuth } from "next-auth/middleware"; // Import withAuth from next-auth

export default withAuth({
  pages: {
    signIn: "/api/auth/signin", // Redirect to this page if not authenticated
  },
});

export const config = {
  matcher: ["/"], // Protect these routes
};
