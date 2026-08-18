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

  // 2. Sprawdź, czy URL zawiera parametr zapytania: ?admin=poleczka
  if (url.searchParams.get("admin") === "poleczka") {
    url.searchParams.delete("admin");
    const response = NextResponse.redirect(url);
    response.cookies.set("dev_access", "true", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 dni dostępu
      sameSite: "lax",
    });
    return response;
  }

  // 3. Sprawdź, czy użytkownik posiada ciasteczko dev_access
  const hasDevAccess = request.cookies.get("dev_access")?.value === "true";

  if (hasDevAccess) {
    return NextResponse.next();
  }

  // 4. Bezwzględne przerwanie, jeśli jesteśmy już na /coming-soon
  if (url.pathname.startsWith("/coming-soon")) {
    return NextResponse.next();
  }

  // 5. Zastosuj rewrite na /coming-soon dla wszystkich innych stron
  const comingSoonUrl = url.clone();
  comingSoonUrl.pathname = "/coming-soon";
  return NextResponse.rewrite(comingSoonUrl);
}

// Zdefiniuj dozwolone ścieżki (matcher), aby omijać pliki statyczne, obrazki, _next, API oraz Sanity Studio
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)'],
};
