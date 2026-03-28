import { NextRequest, NextResponse } from "next/server";

const AUTH_REALM = "The Little Sweetery Admin";

export function isAdminAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!authHeader || !expectedPassword) return false;

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const [, password] = decoded.split(":");

  // Username is intentionally ignored. Password is the gate.
  return password === expectedPassword;
}

export function unauthorizedAdminResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    {
      status: 401,
      headers: { "WWW-Authenticate": `Basic realm="${AUTH_REALM}"` },
    },
  );
}
