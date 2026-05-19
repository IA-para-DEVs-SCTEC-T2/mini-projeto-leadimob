/**
 * OpenAPI Schemas
 * Definição de schemas OpenAPI para documentação automática
 */

import { extendZodWithOpenApi } from "zod-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// ============================================================================
// LEAD SCHEMAS
// ============================================================================

/**
 * Schema para Lead completo (resposta do servidor)
 */
export const LeadResponseSchema = z.object({
  id: z.string().openapi({
    description: "ID único do lead (CUID)",
    example: "clh7x8q9z0000qz088a1b2c3d",
  }),
  nome: z.string().openapi({
    description: "Nome completo do lead",
    example: "Ana Costa",
  }),
  email: z.string().email().openapi({
    description: "Email do lead",
    example: "ana.costa@email.com",
  }),
  cpf: z.string().openapi({
    description: "CPF do lead (11 dígitos, sem formatação)",
    example: "12345678901",
  }),
  telefone: z.string().openapi({
    description: "Telefone do lead (10-15 dígitos, sem formatação)",
    example: "11987654321",
  }),
  valor_imovel: z.number().openapi({
    description: "Valor do imóvel desejado em reais",
    example: 400000,
  }),
  renda_mensal: z.number().openapi({
    description: "Renda mensal do lead em reais",
    example: 12000,
  }),
  score: z.number().nullable().openapi({
    description:
      "Índice de Qualificação Financeira (0-100). Null se valor_imovel for zero.",
    example: 90,
  }),
  priority: z.enum(["Alto", "Medio", "Baixo", "NaoClassificado"]).openapi({
    description:
      "Classificação de prioridade: Alto (≥80), Médio (40-79), Baixo (<40), NaoClassificado (score inválido)",
    example: "Alto",
  }),
  created_at: z.string().datetime().openapi({
    description: "Data e hora de criação do lead (ISO 8601)",
    example: "2026-05-18T10:30:00Z",
  }),
});

/**
 * Schema para criação de Lead (request)
 */
export const CreateLeadRequestSchema = z.object({
  nome: z.string().min(2).max(100).openapi({
    description: "Nome completo do lead (2-100 caracteres)",
    example: "Ana Costa",
  }),
  email: z.string().email().openapi({
    description: "Email válido do lead",
    example: "ana.costa@email.com",
  }),
  cpf: z.string().openapi({
    description: "CPF do lead (11 dígitos, pode conter formatação)",
    example: "123.456.789-01",
  }),
  telefone: z.string().openapi({
    description: "Telefone do lead (10-15 dígitos, pode conter formatação)",
    example: "(11) 98765-4321",
  }),
  valor_imovel: z.number().min(0.01).openapi({
    description: "Valor do imóvel desejado em reais (> 0)",
    example: 400000,
  }),
  renda_mensal: z.number().min(0.01).openapi({
    description: "Renda mensal do lead em reais (> 0)",
    example: 12000,
  }),
});

/**
 * Schema para atualização de Lead (request)
 */
export const UpdateLeadRequestSchema = z.object({
  nome: z.string().min(2).max(100).openapi({
    description: "Nome completo do lead (2-100 caracteres)",
    example: "Ana Costa Silva",
  }),
  email: z.string().email().openapi({
    description: "Email válido do lead",
    example: "ana.silva@email.com",
  }),
  cpf: z.string().openapi({
    description: "CPF do lead (11 dígitos, pode conter formatação)",
    example: "123.456.789-01",
  }),
  telefone: z.string().openapi({
    description: "Telefone do lead (10-15 dígitos, pode conter formatação)",
    example: "(11) 98765-4321",
  }),
  valor_imovel: z.number().min(0.01).openapi({
    description: "Valor do imóvel desejado em reais (> 0)",
    example: 450000,
  }),
  renda_mensal: z.number().min(0.01).openapi({
    description: "Renda mensal do lead em reais (> 0)",
    example: 13000,
  }),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Schema para resposta de sucesso genérica
 */
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true).openapi({
      description: "Indica sucesso da operação",
    }),
    data: dataSchema,
  });

/**
 * Schema para resposta de erro
 */
export const ErrorResponseSchema = z.object({
  success: z.literal(false).openapi({
    description: "Indica falha da operação",
  }),
  error: z.string().openapi({
    description: "Mensagem de erro",
    example: "CPF já cadastrado no sistema",
  }),
});

/**
 * Schema para resposta de erro de validação
 */
export const ValidationErrorResponseSchema = z.object({
  success: z.literal(false).openapi({
    description: "Indica falha de validação",
  }),
  errors: z.record(z.array(z.string())).openapi({
    description: "Mapa de erros por campo",
    example: {
      email: ["Email inválido"],
      cpf: ["CPF já cadastrado"],
    },
  }),
});

/**
 * Schema para lista de leads
 */
export const LeadsListResponseSchema = z.object({
  success: z.literal(true).openapi({
    description: "Indica sucesso da operação",
  }),
  data: z.array(LeadResponseSchema).openapi({
    description: "Lista de leads ordenados por score (decrescente)",
  }),
  total: z.number().openapi({
    description: "Total de leads no sistema",
    example: 42,
  }),
});

// ============================================================================
// EXPORTS
// ============================================================================

export type LeadResponse = z.infer<typeof LeadResponseSchema>;
export type CreateLeadRequest = z.infer<typeof CreateLeadRequestSchema>;
export type UpdateLeadRequest = z.infer<typeof UpdateLeadRequestSchema>;
