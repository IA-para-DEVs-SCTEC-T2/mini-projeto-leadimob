"use server";

import { redirect } from "next/navigation";

import { corretor_repository } from "@/infra/repositories/corretor_repository";
import { RegisterSchema } from "@/schemas/corretor.schema";
import { create_corretor } from "@/services/create_corretor";

interface RegisterActionResult {
  success: boolean
  errors?: {
    nome?: string[]
    email?: string[]
    telefone?: string[]
    senha?: string[]
    _form?: string[]
  }
}

export async function register_action(
  formData: FormData,
): Promise<RegisterActionResult | never> {
  // Extrair dados do FormData
  const data = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: (formData.get("telefone") as string) || undefined,
    senha: formData.get("senha") as string,
  };

  // Validar com Zod
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Tentar criar o corretor
  try {
    await create_corretor(corretor_repository, result.data);
  } catch (error: unknown) {
    // Erro de email duplicado
    if (
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      (error as { error: string }).error === "EMAIL_ALREADY_EXISTS"
    ) {
      return {
        success: false,
        errors: {
          _form: ["Dados já cadastrados. Tente fazer login ou use outro endereço."],
        },
      };
    }

    // Erro genérico
    console.error("Error in register_action:", error);
    return {
      success: false,
      errors: {
        _form: ["Erro interno. Tente novamente."],
      },
    };
  }

  // Sucesso - redirecionar para login (fora do try/catch para não capturar NEXT_REDIRECT)
  redirect("/auth/login");
}
