import { z } from "zod";
import { validate_cpf } from "@/lib/formatters";

export const CreateLeadSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(100, "Nome deve ter no maximo 100 caracteres."),
  email: z.string().email("Informe um email valido."),
  cpf: z
    .string()
    .transform((cpf) => cpf.replace(/\D/g, ""))
    .refine(
      (cpf) => cpf.length === 11,
      "CPF deve conter 11 digitos.",
    )
    .refine(
      (cpf) => validate_cpf(cpf),
      "CPF inválido. Verifique os dígitos informados.",
    ),
  telefone: z
    .string()
    .transform((telefone) => telefone.replace(/\D/g, ""))
    .refine(
      (telefone) => telefone.length >= 10 && telefone.length <= 15,
      "Telefone deve conter entre 10 e 15 digitos.",
    ),
  valor_imovel: z
    .number()
    .min(0.01, "Valor do imovel deve ser maior que zero."),
  renda_mensal: z
    .number()
    .min(0.01, "Renda mensal deve ser maior que zero."),
});

export const UpdateLeadSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(100, "Nome deve ter no maximo 100 caracteres."),
  email: z.string().email("Informe um email valido."),
  cpf: z
    .string()
    .transform((cpf) => cpf.replace(/\D/g, ""))
    .refine(
      (cpf) => cpf.length === 11,
      "CPF deve conter 11 digitos.",
    )
    .refine(
      (cpf) => validate_cpf(cpf),
      "CPF inválido. Verifique os dígitos informados.",
    ),
  telefone: z
    .string()
    .transform((telefone) => telefone.replace(/\D/g, ""))
    .refine(
      (telefone) => telefone.length >= 10 && telefone.length <= 15,
      "Telefone deve conter entre 10 e 15 digitos.",
    ),
  valor_imovel: z
    .number()
    .min(0.01, "Valor do imovel deve ser maior que zero."),
  renda_mensal: z
    .number()
    .min(0.01, "Renda mensal deve ser maior que zero."),
});

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;