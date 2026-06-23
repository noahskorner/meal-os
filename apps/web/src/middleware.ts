import { NextRequest, NextResponse } from "next/server";

const defaultAllowedOrigins = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
];

const expoGoAllowedOriginPattern =
  /^(?:exp|http):\/\/(?:(?:localhost|127\.0\.0\.1|10\.0\.2\.2)|(?:10(?:\.\d{1,3}){3})|(?:172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})|(?:192\.168(?:\.\d{1,3}){2})):8081$/;

function getConfiguredAllowedOrigins() {
  return process.env.CORS_ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string) {
  const configuredOrigins = getConfiguredAllowedOrigins();

  if (configuredOrigins?.length) {
    return configuredOrigins.includes(origin);
  }

  return (
    defaultAllowedOrigins.includes(origin) ||
    expoGoAllowedOriginPattern.test(origin)
  );
}

function applyCorsHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin");

  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Type",
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return applyCorsHeaders(request, new NextResponse(null, { status: 204 }));
  }

  return applyCorsHeaders(request, NextResponse.next());
}

export const config = {
  matcher: "/api/:path*",
};
