/**
 * Route Handler: GET/PUT/DELETE /api/leads/[id]
 * Endpoints para obter, atualizar e deletar leads específicos
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { lead_repository } from "@/infra/repositories/lead_repository";
import { UpdateLeadSchema } from "@/schemas/lead.schema";
import { delete_lead } from "@/services/delete_lead";
import { update_lead } from "@/services/update_lead";

// ============================================================================
// GET /api/leads/[id]
// ============================================================================

/**
 * Obtém um lead específico pelo ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const lead = await lead_repository.find_by_id(id);

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead não encontrado.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...lead,
          valor_imovel: Number(lead.valor_imovel),
          renda_mensal: Number(lead.renda_mensal),
          score: lead.score ? Number(lead.score) : null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching lead:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar lead. Tente novamente.",
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/leads/[id]
// ============================================================================

/**
 * Atualiza um lead existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validation_result = UpdateLeadSchema.safeParse(body);

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

    // Validation passed, update lead
    const validated_input = validation_result.data;

    try {
      const updated_lead = await update_lead(
        lead_repository,
        id,
        validated_input,
      );

      return NextResponse.json(
        {
          success: true,
          data: {
            ...updated_lead,
            valor_imovel: Number(updated_lead.valor_imovel),
            renda_mensal: Number(updated_lead.renda_mensal),
            score: updated_lead.score ? Number(updated_lead.score) : null,
          },
        },
        { status: 200 },
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
      console.error("Unmapped error in PUT /api/leads/[id]:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao atualizar lead. Tente novamente.",
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

// ============================================================================
// DELETE /api/leads/[id]
// ============================================================================

/**
 * Deleta um lead
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    try {
      await delete_lead(lead_repository, id);

      return NextResponse.json(null, { status: 204 });
    } catch (error) {
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
      console.error("Unmapped error in DELETE /api/leads/[id]:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao excluir lead. Tente novamente.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error deleting lead:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao excluir lead. Tente novamente.",
      },
      { status: 500 },
    );
  }
}
