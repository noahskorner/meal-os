import { NextResponse } from "next/server";
import { openApiDocument } from "@/app/features/openapi/openapi-document";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(openApiDocument);
}
