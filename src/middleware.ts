import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/api/ratings/:path*",
    "/api/comments/:path*",
    "/api/clubs/:path*",
  ]
};
