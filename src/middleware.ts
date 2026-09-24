import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 1. HTTP Basic Authentication for /panel and /admin routes
  if (url.pathname.startsWith("/panel") || url.pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
      const authValue = authHeader.split(" ")[1];
      if (authValue) {
        try {
          const [user, pwd] = atob(authValue).split(":");
          const expectedPassword = process.env.ADMIN_PASSWORD || "BistroMPM26!";
          if (user === "admin" && pwd === expectedPassword) {
            return NextResponse.next();
          }
        } catch {
          // Invalid base64 or format
        }
      }
    }

    return new NextResponse("Authentication Required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

// Zdefiniuj dozwolone ścieżki (matcher), aby omijać pliki statyczne, obrazki, _next, API oraz Sanity Studio
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|css|js)$).*)',
  ],
};
