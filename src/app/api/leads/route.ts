/**
 * Route Handler: GET/POST /api/leads
 * Endpoints para listar e criar leads
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { lead_repository } from "@/infra/repositories/lead_repository";
import { CreateLeadSchema } from "@/schemas/lead.schema";
import { create_lead } from "@/services/create_lead";
import { list_leads } from "@/services/list_leads";

// ============================================================================
// GET /api/leads
// ============================================================================

/**
 * Lista todos os leads ordenados por score
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  try {
    const leads = await list_leads(lead_repository, session.user.id);

    return NextResponse.json(
      {
        success: true,
        data: leads.map((lead) => ({
          ...lead,
          valor_imovel: Number(lead.valor_imovel),
          renda_mensal: Number(lead.renda_mensal),
          score: lead.score ? Number(lead.score) : null,
        })),
        total: leads.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error listing leads:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao listar leads. Tente novamente.",
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/leads
// ============================================================================

/**
 * Cria um novo lead
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate with Zod
    const validation_result = CreateLeadSchema.safeParse(body);

    if (!validation_result.success) {
      // Return validation errors
      const errors: Record<string, string[]> = {};

      for (const issue of validation_result.error.issues) {
        const field = issue.path[0];

        if (typeof field === "string") {
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(issue.message);
        }
      }

      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 },
      );
    }

    // Validation passed, create lead
    const validated_input = validation_result.data;

    try {
      const created_lead = await create_lead(lead_repository, validated_input, session.user.id);

      return NextResponse.json(
        {
          success: true,
          data: {
            ...created_lead,
            valor_imovel: Number(created_lead.valor_imovel),
            renda_mensal: Number(created_lead.renda_mensal),
            score: created_lead.score ? Number(created_lead.score) : null,
          },
        },
        { status: 201 },
      );
    } catch (error) {
      // Handle CPF_ALREADY_EXISTS error
      if (
        typeof error === "object" &&
        error !== null &&
        "error" in error &&
        error.error === "CPF_ALREADY_EXISTS"
      ) {
        return NextResponse.json(
          {
            success: false,
            errors: {
              cpf: ["Este CPF já está cadastrado."],
            },
          },
          { status: 400 },
        );
      }

      // Handle DATABASE_UNAVAILABLE error
      if (
        typeof error === "object" &&
        error !== null &&
        "error" in error &&
        error.error === "DATABASE_UNAVAILABLE"
      ) {
        console.error("Database unavailable:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Erro ao conectar ao banco de dados. Tente novamente.",
          },
          { status: 500 },
        );
      }

      // Log unmapped errors
      console.error("Unmapped error in POST /api/leads:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao criar lead. Tente novamente.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error parsing request body:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar requisição. Verifique o formato JSON.",
      },
      { status: 400 },
    );
  }
}
