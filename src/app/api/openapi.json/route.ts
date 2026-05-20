/**
 * Route Handler: GET /api/openapi.json
 * Serve a especificação OpenAPI em formato JSON
 */

import { NextResponse } from "next/server";

import { get_openapi_document } from "@/lib/openapi/registry";

export async function GET() {
  try {
    const spec = get_openapi_document();

    return NextResponse.json(spec, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating OpenAPI spec:", error);

    return NextResponse.json(
      {
        error: "Erro ao gerar especificação OpenAPI",
      },
      { status: 500 },
    );
  }
}
