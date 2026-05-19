/**
 * OpenAPI Registry
 * Registro centralizado de todas as rotas e schemas OpenAPI
 */

import { createDocument } from "zod-openapi";

import { openapi_config } from "./config";
import {
  CreateLeadRequestSchema,
  ErrorResponseSchema,
  LeadResponseSchema,
  LeadsListResponseSchema,
  SuccessResponseSchema,
  UpdateLeadRequestSchema,
  ValidationErrorResponseSchema,
} from "./schemas";

// ============================================================================
// DEFINE ROUTES
// ============================================================================

const routes = [
  {
    method: "get" as const,
    path: "/api/leads",
    description:
      "Retorna uma lista de todos os leads cadastrados, ordenados por Índice de Qualificação Financeira (score) em ordem decrescente.",
    summary: "Listar todos os leads",
    tags: ["Leads"],
    responses: {
      "200": {
        description: "Lista de leads retornada com sucesso",
        content: {
          "application/json": {
            schema: LeadsListResponseSchema,
          },
        },
      },
      "500": {
        description: "Erro interno do servidor",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  },
  {
    method: "post" as const,
    path: "/api/leads",
    description:
      "Cria um novo lead com os dados fornecidos. O Índice de Qualificação Financeira é calculado automaticamente usando a fórmula: (Renda × 12 × 5) ÷ Valor do Imóvel × 100",
    summary: "Criar novo lead",
    tags: ["Leads"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: CreateLeadRequestSchema,
        },
      },
    },
    responses: {
      "201": {
        description: "Lead criado com sucesso",
        content: {
          "application/json": {
            schema: SuccessResponseSchema(LeadResponseSchema),
          },
        },
      },
      "400": {
        description: "Erro de validação ou CPF já cadastrado",
        content: {
          "application/json": {
            schema: ValidationErrorResponseSchema,
          },
        },
      },
      "500": {
        description: "Erro interno do servidor",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  },
  {
    method: "get" as const,
    path: "/api/leads/{id}",
    description: "Retorna os detalhes de um lead específico pelo seu ID.",
    summary: "Obter lead por ID",
    tags: ["Leads"],
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        description: "ID único do lead (CUID)",
        schema: {
          type: "string",
          example: "clh7x8q9z0000qz088a1b2c3d",
        },
      },
    ],
    responses: {
      "200": {
        description: "Lead encontrado",
        content: {
          "application/json": {
            schema: SuccessResponseSchema(LeadResponseSchema),
          },
        },
      },
      "404": {
        description: "Lead não encontrado",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      "500": {
        description: "Erro interno do servidor",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  },
  {
    method: "put" as const,
    path: "/api/leads/{id}",
    description:
      "Atualiza os dados de um lead existente. O Índice de Qualificação Financeira é recalculado automaticamente.",
    summary: "Atualizar lead",
    tags: ["Leads"],
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        description: "ID único do lead (CUID)",
        schema: {
          type: "string",
          example: "clh7x8q9z0000qz088a1b2c3d",
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: UpdateLeadRequestSchema,
        },
      },
    },
    responses: {
      "200": {
        description: "Lead atualizado com sucesso",
        content: {
          "application/json": {
            schema: SuccessResponseSchema(LeadResponseSchema),
          },
        },
      },
      "400": {
        description: "Erro de validação ou CPF já cadastrado",
        content: {
          "application/json": {
            schema: ValidationErrorResponseSchema,
          },
        },
      },
      "404": {
        description: "Lead não encontrado",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      "500": {
        description: "Erro interno do servidor",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  },
  {
    method: "delete" as const,
    path: "/api/leads/{id}",
    description: "Remove um lead do sistema permanentemente.",
    summary: "Deletar lead",
    tags: ["Leads"],
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        description: "ID único do lead (CUID)",
        schema: {
          type: "string",
          example: "clh7x8q9z0000qz088a1b2c3d",
        },
      },
    ],
    responses: {
      "204": {
        description: "Lead deletado com sucesso",
      },
      "404": {
        description: "Lead não encontrado",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      "500": {
        description: "Erro interno do servidor",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  },
];

// ============================================================================
// GENERATE SPEC
// ============================================================================

export function get_openapi_document() {
  return createDocument({
    openapi: openapi_config.openapi,
    info: openapi_config.info,
    servers: openapi_config.servers,
    tags: openapi_config.tags,
    paths: routes.reduce(
      (acc, route) => {
        const pathKey = route.path;
        if (!acc[pathKey]) {
          acc[pathKey] = {};
        }
        acc[pathKey][route.method] = {
          summary: route.summary,
          description: route.description,
          tags: route.tags,
          ...(route.parameters && { parameters: route.parameters }),
          ...(route.requestBody && { requestBody: route.requestBody }),
          responses: route.responses,
        };
        return acc;
      },
      {} as Record<string, Record<string, unknown>>,
    ),
  });
}
