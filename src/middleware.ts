import {getToken} from "next-auth/jwt";
import {NextRequest, NextResponse} from "next/server";

/**
 * Middleware function
 * If a user is logged in, redirect them to their profile
 * @param {NextRequest} req request
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({req});

  if (token) {
    return NextResponse.redirect(new URL(`/${token.role}s/${token.id}`, req.url));
  }
}

export const config = {
  matcher: ["/signin"],
};
