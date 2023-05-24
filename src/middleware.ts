import {getToken} from "next-auth/jwt";
import {NextRequest, NextResponse} from "next/server";

/**
 * Middleware function
 * If a user is logged in, redirect them to their profile
 * @param {NextRequest} req request
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({req});


  if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && (req.nextUrl.pathname.startsWith("/auth/signup") || req.nextUrl.pathname.startsWith("/auth/signin"))) {
    return NextResponse.redirect(new URL(`/${token.role}s/${token.id}`, req.url));
  }

  if (req.nextUrl.pathname.startsWith("/auth/verify")) {
    const {nextUrl: {search}} = req;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (!params.email && !params.token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: ["/auth/:path*", "/admin"],
};
