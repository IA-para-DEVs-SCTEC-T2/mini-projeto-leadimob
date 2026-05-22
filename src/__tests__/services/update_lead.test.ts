import { update_lead } from "@/services/update_lead";
import type { Lead,LeadRepository, UpdateLeadInput } from "@/types/lead";

describe("update_lead", () => {
  const mock_repository: LeadRepository = {
    create: jest.fn(),
    find_all: jest.fn(),
    find_by_id: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update lead with calculated score and priority", async () => {
    const input: UpdateLeadInput = {
      nome: "João Silva Atualizado",
      email: "joao.atualizado@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 400000,
      renda_mensal: 12000,
    };

    const expected_lead: Lead = {
      id: "lead-123",
      nome: "João Silva Atualizado",
      email: "joao.atualizado@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 400000,
      renda_mensal: 12000,
      score: 180,
      priority: "Alto",
      created_at: new Date(),
    };

    (mock_repository.update as jest.Mock).mockResolvedValue(expected_lead);

    const result = await update_lead(mock_repository, "lead-123", "corretor-test-id", input);

    expect(mock_repository.update).toHaveBeenCalledWith("lead-123", "corretor-test-id", {
      nome: "João Silva Atualizado",
      email: "joao.atualizado@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 400000,
      renda_mensal: 12000,
      score: 180,
      priority: "Alto",
    });

    expect(result).toEqual(expected_lead);
  });

  it("should handle invalid data with null score", async () => {
    const input: UpdateLeadInput = {
      nome: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 0, // Invalid value
      renda_mensal: 12000,
    };

    const expected_lead: Lead = {
      id: "lead-123",
      nome: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 0,
      renda_mensal: 12000,
      score: null,
      priority: "NaoClassificado",
      created_at: new Date(),
    };

    (mock_repository.update as jest.Mock).mockResolvedValue(expected_lead);

    const result = await update_lead(mock_repository, "lead-123", "corretor-test-id", input);

    expect(mock_repository.update).toHaveBeenCalledWith("lead-123", "corretor-test-id", {
      nome: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 0,
      renda_mensal: 12000,
      score: null,
      priority: "NaoClassificado",
    });

    expect(result).toEqual(expected_lead);
  });

  it("should normalize email to lowercase", async () => {
    const input: UpdateLeadInput = {
      nome: "João Silva",
      email: "JOAO@EMAIL.COM",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 400000,
      renda_mensal: 12000,
    };

    const expected_lead: Lead = {
      id: "lead-123",
      nome: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 400000,
      renda_mensal: 12000,
      score: 180,
      priority: "Alto",
      created_at: new Date(),
    };

    (mock_repository.update as jest.Mock).mockResolvedValue(expected_lead);

    await update_lead(mock_repository, "lead-123", "corretor-test-id", input);

    expect(mock_repository.update).toHaveBeenCalledWith("lead-123", "corretor-test-id", {
      nome: "João Silva",
      email: "joao@email.com", // Should be normalized
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 400000,
      renda_mensal: 12000,
      score: 180,
      priority: "Alto",
    });
  });

  it("should propagate repository errors", async () => {
    const input: UpdateLeadInput = {
      nome: "João Silva",
      email: "joao@email.com",
      cpf: "12345678901",
      telefone: "11987654321",
      valor_imovel: 400000,
      renda_mensal: 12000,
    };

    const error = new Error("Database error");
    (mock_repository.update as jest.Mock).mockRejectedValue(error);

    await expect(update_lead(mock_repository, "lead-123", "corretor-test-id", input)).rejects.toThrow("Database error");
  });
});

