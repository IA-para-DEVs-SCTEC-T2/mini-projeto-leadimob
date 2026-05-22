/**
 * OpenAPI Schemas
 * Definição de schemas para documentação da API
 * Usa objetos JSON puros compatíveis com OpenAPI 3.0.3
 */

// ============================================================================
// LEAD SCHEMAS (JSON Schema / OpenAPI 3.0.3)
// ============================================================================

export const LeadResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "ID único do lead (CUID)", example: "clh7x8q9z0000qz088a1b2c3d" },
    nome: { type: "string", description: "Nome completo do lead", example: "Ana Costa" },
    email: { type: "string", format: "email", description: "Email do lead", example: "ana.costa@email.com" },
    cpf: { type: "string", description: "CPF do lead (11 dígitos, sem formatação)", example: "12345678901" },
    telefone: { type: "string", description: "Telefone do lead", example: "11987654321" },
    valor_imovel: { type: "number", description: "Valor do imóvel desejado em reais", example: 400000 },
    renda_mensal: { type: "number", description: "Renda mensal do lead em reais", example: 12000 },
    score: { type: "number", nullable: true, description: "Índice de Qualificação Financeira. Null se valor_imovel for zero.", example: 90 },
    priority: {
      type: "string",
      enum: ["Alto", "Medio", "Baixo", "NaoClassificado"],
      description: "Classificação de prioridade: Alto (≥80), Médio (40-79), Baixo (<40), NaoClassificado",
      example: "Alto",
    },
    created_at: { type: "string", format: "date-time", description: "Data e hora de criação (ISO 8601)", example: "2026-05-18T10:30:00Z" },
  },
  required: ["id", "nome", "email", "cpf", "telefone", "valor_imovel", "renda_mensal", "score", "priority", "created_at"],
};

export const CreateLeadRequestSchema = {
  type: "object",
  properties: {
    nome: { type: "string", minLength: 2, maxLength: 100, description: "Nome completo do lead (2-100 caracteres)", example: "Ana Costa" },
    email: { type: "string", format: "email", description: "Email válido do lead", example: "ana.costa@email.com" },
    cpf: { type: "string", description: "CPF do lead (11 dígitos, pode conter formatação)", example: "123.456.789-01" },
    telefone: { type: "string", description: "Telefone do lead (10-15 dígitos)", example: "(11) 98765-4321" },
    valor_imovel: { type: "number", minimum: 0.01, description: "Valor do imóvel desejado em reais (> 0)", example: 400000 },
    renda_mensal: { type: "number", minimum: 0.01, description: "Renda mensal do lead em reais (> 0)", example: 12000 },
  },
  required: ["nome", "email", "cpf", "telefone", "valor_imovel", "renda_mensal"],
};

export const UpdateLeadRequestSchema = {
  type: "object",
  properties: {
    nome: { type: "string", minLength: 2, maxLength: 100, description: "Nome completo do lead (2-100 caracteres)", example: "Ana Costa Silva" },
    email: { type: "string", format: "email", description: "Email válido do lead", example: "ana.silva@email.com" },
    cpf: { type: "string", description: "CPF do lead (11 dígitos, pode conter formatação)", example: "123.456.789-01" },
    telefone: { type: "string", description: "Telefone do lead (10-15 dígitos)", example: "(11) 98765-4321" },
    valor_imovel: { type: "number", minimum: 0.01, description: "Valor do imóvel desejado em reais (> 0)", example: 450000 },
    renda_mensal: { type: "number", minimum: 0.01, description: "Renda mensal do lead em reais (> 0)", example: 13000 },
  },
  required: ["nome", "email", "cpf", "telefone", "valor_imovel", "renda_mensal"],
};

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const SuccessResponseSchema = (dataSchema: object) => ({
  type: "object",
  properties: {
    success: { type: "boolean", enum: [true], description: "Indica sucesso da operação" },
    data: dataSchema,
  },
  required: ["success", "data"],
});

export const ErrorResponseSchema = {
  type: "object",
  properties: {
    success: { type: "boolean", enum: [false], description: "Indica falha da operação" },
    error: { type: "string", description: "Mensagem de erro", example: "CPF já cadastrado no sistema" },
  },
  required: ["success", "error"],
};

export const ValidationErrorResponseSchema = {
  type: "object",
  properties: {
    success: { type: "boolean", enum: [false], description: "Indica falha de validação" },
    errors: {
      type: "object",
      additionalProperties: { type: "array", items: { type: "string" } },
      description: "Mapa de erros por campo",
      example: { email: ["Email inválido"], cpf: ["CPF já cadastrado"] },
    },
  },
  required: ["success", "errors"],
};

export const LeadsListResponseSchema = {
  type: "object",
  properties: {
    success: { type: "boolean", enum: [true], description: "Indica sucesso da operação" },
    data: { type: "array", items: LeadResponseSchema, description: "Lista de leads ordenados por score (decrescente)" },
    total: { type: "number", description: "Total de leads no sistema", example: 42 },
  },
  required: ["success", "data", "total"],
};
