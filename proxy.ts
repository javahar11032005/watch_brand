import { NextRequest, NextResponse } from "next/server";
import { decryptSessionCookie } from "@/lib/proxy-session";

const AUTH_ROUTES = ["/login", "/signup"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isAccountRoute = path.startsWith("/account");
  const isAuthRoute = AUTH_ROUTES.includes(path);

  if (!isAdminRoute && !isAccountRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("kestrel_session")?.value;
  const session = await decryptSessionCookie(cookie);

  if ((isAdminRoute || isAccountRoute) && !session) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/signup"],
};
