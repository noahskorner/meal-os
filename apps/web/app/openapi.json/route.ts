import { NextResponse } from "next/server";
import { openApiDocument } from "../../lib/api/openapi/document";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(openApiDocument);
}
