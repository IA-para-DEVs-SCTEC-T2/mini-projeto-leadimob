"use server";

import { redirect } from "next/navigation";
import { CreateLeadSchema, type CreateLeadInput } from "@/schemas/lead.schema";
import { create_lead } from "@/services/create_lead";
import { lead_repository } from "@/infra/repositories/lead_repository";

type ActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      errors: Record<string, string[]>;
    }
  | {
      success: false;
      error: string;
    };

export async function create_lead_action(
  formData: FormData,
): Promise<ActionResult> {
  // Extract fields from FormData
  const nome = formData.get("nome");
  const email = formData.get("email");
  const cpf = formData.get("cpf");
  const telefone = formData.get("telefone");
  const valor_imovel = formData.get("valor_imovel");
  const renda_mensal = formData.get("renda_mensal");

  // Convert types
  const data = {
    nome,
    email,
    cpf,
    telefone,
    valor_imovel:
      valor_imovel === "" || valor_imovel === null
        ? NaN
        : Number(valor_imovel),
    renda_mensal:
      renda_mensal === "" || renda_mensal === null
        ? NaN
        : Number(renda_mensal),
  };

  // Validate with Zod
  const validation_result = CreateLeadSchema.safeParse(data);

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

    return {
      success: false,
      errors,
    };
  }

  // Validation passed, create lead
  const validated_input: CreateLeadInput = validation_result.data;

  try {
    await create_lead(lead_repository, validated_input);

    // Redirect on success
    redirect("/leads");
  } catch (error) {
    // Handle CPF_ALREADY_EXISTS error
    if (
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      error.error === "CPF_ALREADY_EXISTS"
    ) {
      return {
        success: false,
        errors: {
          cpf: ["Este CPF já está cadastrado."],
        },
      };
    }

    // Handle DATABASE_UNAVAILABLE error
    if (
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      error.error === "DATABASE_UNAVAILABLE"
    ) {
      console.error("Database unavailable:", error);
      return {
        success: false,
        error: "Erro ao conectar ao banco de dados. Tente novamente.",
      };
    }

    // Log unmapped errors
    console.error("Unmapped error in create_lead_action:", error);
    return {
      success: false,
      error: "Erro ao criar lead. Tente novamente.",
    };
  }
}
