import { z } from "zod";

export const RegisterSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(100, "Nome deve ter no máximo 100 caracteres."),
  email: z.string().email("Informe um email válido."),
  telefone: z
    .string()
    .optional()
    .transform((val) => val?.replace(/\D/g, '') || undefined)
    .refine((val) => !val || val.length >= 10, {
      message: "Telefone inválido.",
    }),
  senha: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres."),
});

export const LoginSchema = z.object({
  email: z.string().email("Informe um email válido."),
  senha: z
    .string()
    .min(1, "Senha é obrigatória."),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
