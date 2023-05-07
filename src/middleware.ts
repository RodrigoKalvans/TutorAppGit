import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
    function middleware(req) {
      if (req.nextauth.token && req.nextUrl.pathname.startsWith("/signin")) {
        return NextResponse.redirect(
            new URL(`/${req.nextauth.token.role}s/${req.nextauth.token.id}`, req.url),
        );
      }
    },
);

export const config = {
  matcher: ["/signin"],
};
