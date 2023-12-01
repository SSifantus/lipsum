import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    '/((?!_next|api/auth).*)(.+)'
  ],
};
export default async function middleware(req: NextRequest) {

  // Get the pathname of the request (e.g. /, /dashboard)
  const path = req.nextUrl.pathname;

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // const publicRoutes = ["/login", "/register"];
  // if (!session && !publicRoutes.includes(path)) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
  // if (session && publicRoutes.includes(path)) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  return NextResponse.next();
}


