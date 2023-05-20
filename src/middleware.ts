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
    // TODO change this when publishing
    return;
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token) {
    return NextResponse.redirect(new URL(`/${token.role}s/${token.id}`, req.url));
  }
}

export const config = {
  matcher: ["/auth/signin", "/auth/signup", "/admin"],
};
