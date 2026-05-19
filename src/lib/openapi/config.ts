/**
 * OpenAPI 3.0.3 Configuration
 * Configuração centralizada da especificação OpenAPI para a API LeadImobi
 *
 * Usamos 3.0.3 em vez de 3.1.0 pois o Swagger UI 5.x tem bugs conhecidos
 * com o parser apidom ao renderizar specs 3.1 no browser (onComplete não
 * dispara, loading infinito). O OAS 3.0.3 tem suporte universal e estável.
 */

export const openapi_config = {
  openapi: "3.0.3" as const,
  info: {
    title: "LeadImobi API",
    description:
      "API REST para qualificação inteligente de leads imobiliários. Centraliza o cadastro de leads e calcula automaticamente um Índice de Qualificação Financeira baseado em padrões bancários.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://api.leadimobi.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Leads",
      description: "Operações de gerenciamento de leads imobiliários",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
