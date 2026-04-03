import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

function unauthorized(isPrefetch: boolean) {
  const headers: Record<string, string> = {
    "Content-Type": "text/plain",
  };
  
  if (!isPrefetch) {
    headers["WWW-Authenticate"] = 'Basic realm="The Little Sweetery Admin"';
  }
  
  return new NextResponse("Unauthorized", {
    status: 401,
    headers,
  });
}

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!authHeader || !expectedPassword) return false;

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  const decoded = atob(encoded);
  const [, password] = decoded.split(":");
  return password === expectedPassword;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Update Supabase session (refreshes cookies)
  const supabaseResponse = await updateSession(request);

  const requiresAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/ratings/") ||
    (pathname === "/api/bookings" && request.method === "GET" && !pathname.startsWith("/admin"));

  if (requiresAdmin && !isAuthorized(request)) {
    const isPrefetch = 
      request.headers.get("next-router-prefetch") === "1" || 
      request.headers.get("purpose") === "prefetch";
    return unauthorized(isPrefetch);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
