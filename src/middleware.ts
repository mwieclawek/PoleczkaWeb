import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 1. Sprawdź, czy URL zawiera parametr zapytania: ?admin=poleczka
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

  // 2. Sprawdź, czy użytkownik posiada ciasteczko dev_access
  const hasDevAccess = request.cookies.get("dev_access")?.value === "true";

  if (hasDevAccess) {
    return NextResponse.next();
  }

  // 3. Jeśli użytkownik NIE posiada ciasteczka i NIE znajduje się już na ścieżce /coming-soon
  if (url.pathname !== "/coming-soon") {
    const comingSoonUrl = url.clone();
    comingSoonUrl.pathname = "/coming-soon";
    return NextResponse.rewrite(comingSoonUrl);
  }

  return NextResponse.next();
}

// Zdefiniuj dozwolone ścieżki (matcher), aby omijać pliki statyczne, obrazki, _next, API oraz Sanity Studio
export const config = {
  matcher: [
    /*
     * Dopasuj wszystkie ścieżki z wyjątkiem:
     * - _next/static (pliki statyczne z kompilacji)
     * - _next/image (optymalizacja obrazków Next.js)
     * - favicon.ico
     * - api (trasy API)
     * - studio (panel Sanity CMS)
     * - pliki graficzne/statyczne (.png, .jpg, .jpeg, .gif, .webp, .svg, .ico, .woff, .woff2, .ttf)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
  ],
};
