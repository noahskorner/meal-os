import { NextResponse } from "next/server";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const scope = createServiceScope();
  const listUnitsController = await scope.resolve(
    SERVICE_TOKENS.listUnitsController,
  );
  const response = await listUnitsController.get();

  return NextResponse.json(response.body, { status: response.status });
}
