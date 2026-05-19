"use server";

import { redirect } from "next/navigation";

import { lead_repository } from "@/infra/repositories/lead_repository";
import { type CreateLeadInput, CreateLeadSchema, type UpdateLeadInput,UpdateLeadSchema } from "@/schemas/lead.schema";
import { create_lead } from "@/services/create_lead";
import { delete_lead } from "@/services/delete_lead";
import { update_lead } from "@/services/update_lead";

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

  // Redirect on success (after try/catch to avoid capturing NEXT_REDIRECT)
  redirect("/leads");
}

export async function update_lead_action(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  // Extract fields from FormData
  const nome = formData.get("nome");
  const email = formData.get("email");
  const cpf = formData.get("cpf");
  const telefone = formData.get("telefone");
  const valor_imovel = formData.get("valor_imovel");
  const renda_mensal = formData.get("renda_mensal");

  // Convert to proper types
  const data = {
    nome: nome?.toString() || "",
    email: email?.toString() || "",
    cpf: cpf?.toString() || "",
    telefone: telefone?.toString() || "",
    valor_imovel: parseFloat(valor_imovel?.toString() || "0"),
    renda_mensal: parseFloat(renda_mensal?.toString() || "0"),
  };

  // Validate with Zod
  const validation_result = UpdateLeadSchema.safeParse(data);

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

  // Validation passed, update lead
  const validated_input: UpdateLeadInput = validation_result.data;

  try {
    await update_lead(lead_repository, id, validated_input);
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
    console.error("Unmapped error in update_lead_action:", error);
    return {
      success: false,
      error: "Erro ao atualizar lead. Tente novamente.",
    };
  }

  // Redirect on success (after try/catch to avoid capturing NEXT_REDIRECT)
  redirect(`/leads/${id}`);
}

export async function delete_lead_action(id: string): Promise<ActionResult> {
  try {
    await delete_lead(lead_repository, id);
  } catch (error) {
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
    console.error("Unmapped error in delete_lead_action:", error);
    return {
      success: false,
      error: "Erro ao excluir lead. Tente novamente.",
    };
  }

  // Redirect on success (after try/catch to avoid capturing NEXT_REDIRECT)
  redirect("/leads");
}
