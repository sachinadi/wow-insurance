import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "./lib/auth";

function getSecretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/dashboard");

  if (!isAdminRoute && !isUserRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let role: string | undefined;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      role = payload.role as string;
    } catch {
      role = undefined;
    }
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/login/admin", req.url));
  }

  if (isUserRoute && role !== "enduser") {
    return NextResponse.redirect(new URL("/login/user", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
