import { create_lead } from "@/services/create_lead";
import type { CreateLeadInput, Lead, LeadRepository } from "@/types/lead";

describe("create_lead service", () => {
  // Task 8.5: Integration tests for create_lead service with mocks

  let mockRepository: jest.Mocked<LeadRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      find_all: jest.fn(),
      find_by_id: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful lead creation", () => {
    it("should create lead with valid score and Alto priority", async () => {
      const input: CreateLeadInput = {
        nome: "Ana Costa",
        email: "ANA@EXAMPLE.COM", // Test email normalization
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const expectedLead: Lead = {
        id: "generated-id",
        nome: "Ana Costa",
        email: "ana@example.com", // Should be normalized
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
        score: 180, // (12000 * 12 * 5) / 400000 * 100
        priority: "Alto",
        created_at: new Date("2024-01-01T10:00:00Z"),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      const result = await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith({
        corretor_id: "corretor-test-id",
        nome: "Ana Costa",
        email: "ana@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
        score: 180,
        priority: "Alto",
      });

      expect(result).toEqual(expectedLead);
    });

    it("should create lead with valid score and Alto priority (Bruno case)", async () => {
      const input: CreateLeadInput = {
        nome: "Bruno Lima",
        email: "bruno@example.com",
        cpf: "22255588846",
        telefone: "11888888888",
        valor_imovel: 380000,
        renda_mensal: 6000,
      };

      const expectedLead: Lead = {
        id: "generated-id-2",
        nome: "Bruno Lima",
        email: "bruno@example.com",
        cpf: "22255588846",
        telefone: "11888888888",
        valor_imovel: 380000,
        renda_mensal: 6000,
        score: 94.74, // (6000 * 12 * 5) / 380000 * 100
        priority: "Alto",
        created_at: new Date("2024-01-01T11:00:00Z"),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      const result = await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith({
        corretor_id: "corretor-test-id",
        nome: "Bruno Lima",
        email: "bruno@example.com",
        cpf: "22255588846",
        telefone: "11888888888",
        valor_imovel: 380000,
        renda_mensal: 6000,
        score: 94.74,
        priority: "Alto",
      });

      expect(result).toEqual(expectedLead);
    });

    it("should create lead with valid score and Medio priority", async () => {
      const input: CreateLeadInput = {
        nome: "Carla Melo",
        email: "carla@example.com",
        cpf: "33366699957",
        telefone: "11777777777",
        valor_imovel: 450000,
        renda_mensal: 3000,
      };

      const expectedLead: Lead = {
        id: "generated-id-3",
        nome: "Carla Melo",
        email: "carla@example.com",
        cpf: "33366699957",
        telefone: "11777777777",
        valor_imovel: 450000,
        renda_mensal: 3000,
        score: 40, // (3000 * 12 * 5) / 450000 * 100
        priority: "Medio",
        created_at: new Date("2024-01-01T12:00:00Z"),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      const result = await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith({
        corretor_id: "corretor-test-id",
        nome: "Carla Melo",
        email: "carla@example.com",
        cpf: "33366699957",
        telefone: "11777777777",
        valor_imovel: 450000,
        renda_mensal: 3000,
        score: 40,
        priority: "Medio",
      });

      expect(result).toEqual(expectedLead);
    });

    it("should create unclassified lead when valor_imovel is zero", async () => {
      const input: CreateLeadInput = {
        nome: "David Silva",
        email: "david@example.com",
        cpf: "44477700068",
        telefone: "11666666666",
        valor_imovel: 0,
        renda_mensal: 5000,
      };

      const expectedLead: Lead = {
        id: "generated-id-4",
        nome: "David Silva",
        email: "david@example.com",
        cpf: "44477700068",
        telefone: "11666666666",
        valor_imovel: 0,
        renda_mensal: 5000,
        score: null,
        priority: "NaoClassificado",
        created_at: new Date("2024-01-01T13:00:00Z"),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      const result = await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith({
        corretor_id: "corretor-test-id",
        nome: "David Silva",
        email: "david@example.com",
        cpf: "44477700068",
        telefone: "11666666666",
        valor_imovel: 0,
        renda_mensal: 5000,
        score: null,
        priority: "NaoClassificado",
      });

      expect(result).toEqual(expectedLead);
    });

    it("should create unclassified lead when renda_mensal is zero", async () => {
      const input: CreateLeadInput = {
        nome: "Elena Santos",
        email: "elena@example.com",
        cpf: "55588811179",
        telefone: "11555555555",
        valor_imovel: 300000,
        renda_mensal: 0,
      };

      const expectedLead: Lead = {
        id: "generated-id-5",
        nome: "Elena Santos",
        email: "elena@example.com",
        cpf: "55588811179",
        telefone: "11555555555",
        valor_imovel: 300000,
        renda_mensal: 0,
        score: null,
        priority: "NaoClassificado",
        created_at: new Date("2024-01-01T14:00:00Z"),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      const result = await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith({
        corretor_id: "corretor-test-id",
        nome: "Elena Santos",
        email: "elena@example.com",
        cpf: "55588811179",
        telefone: "11555555555",
        valor_imovel: 300000,
        renda_mensal: 0,
        score: null,
        priority: "NaoClassificado",
      });

      expect(result).toEqual(expectedLead);
    });
  });

  describe("Email normalization", () => {
    it("should normalize email to lowercase", async () => {
      const input: CreateLeadInput = {
        nome: "Test User",
        email: "TEST@EXAMPLE.COM",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const expectedLead: Lead = {
        id: "test-id",
        nome: "Test User",
        email: "test@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
        score: 180,
        priority: "Alto",
        created_at: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
        })
      );
    });

    it("should trim whitespace from email", async () => {
      const input: CreateLeadInput = {
        nome: "Test User",
        email: "  test@example.com  ",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const expectedLead: Lead = {
        id: "test-id",
        nome: "Test User",
        email: "test@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
        score: 180,
        priority: "Alto",
        created_at: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
        })
      );
    });
  });

  describe("Score calculation integration", () => {
    it("should calculate score correctly for edge case (score = 96)", async () => {
      const input: CreateLeadInput = {
        nome: "Edge Case",
        email: "edge@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 500000,
        renda_mensal: 8000,
      };

      const expectedLead: Lead = {
        id: "edge-id",
        nome: "Edge Case",
        email: "edge@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 500000,
        renda_mensal: 8000,
        score: 96, // (8000 * 12 * 5) / 500000 * 100
        priority: "Alto",
        created_at: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 96,
          priority: "Alto",
        })
      );
    });

    it("should handle decimal values in score calculation", async () => {
      const input: CreateLeadInput = {
        nome: "Decimal Test",
        email: "decimal@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 350000,
        renda_mensal: 5500,
      };

      const expectedScore = Math.round(((5500 * 12 * 5) / 350000) * 100 * 100) / 100;

      const expectedLead: Lead = {
        id: "decimal-id",
        nome: "Decimal Test",
        email: "decimal@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 350000,
        renda_mensal: 5500,
        score: expectedScore,
        priority: expectedScore >= 80 ? "Alto" : expectedScore >= 40 ? "Medio" : "Baixo",
        created_at: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          score: expectedScore,
        })
      );
    });
  });

  describe("Repository error handling", () => {
    it("should propagate CPF_ALREADY_EXISTS error", async () => {
      const input: CreateLeadInput = {
        nome: "Duplicate CPF",
        email: "duplicate@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const repositoryError = { error: "CPF_ALREADY_EXISTS" as const };
      mockRepository.create.mockRejectedValue(repositoryError);

      await expect(create_lead(mockRepository, input, "corretor-test-id")).rejects.toEqual(repositoryError);

      expect(mockRepository.create).toHaveBeenCalledWith({
        corretor_id: "corretor-test-id",
        nome: "Duplicate CPF",
        email: "duplicate@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
        score: 180,
        priority: "Alto",
      });
    });

    it("should propagate DATABASE_UNAVAILABLE error", async () => {
      const input: CreateLeadInput = {
        nome: "Database Error",
        email: "db@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const repositoryError = { error: "DATABASE_UNAVAILABLE" as const };
      mockRepository.create.mockRejectedValue(repositoryError);

      await expect(create_lead(mockRepository, input, "corretor-test-id")).rejects.toEqual(repositoryError);
    });

    it("should propagate unexpected errors", async () => {
      const input: CreateLeadInput = {
        nome: "Unexpected Error",
        email: "unexpected@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const unexpectedError = new Error("Unexpected database error");
      mockRepository.create.mockRejectedValue(unexpectedError);

      await expect(create_lead(mockRepository, input, "corretor-test-id")).rejects.toThrow("Unexpected database error");
    });
  });

  describe("Data transformation", () => {
    it("should pass through all input fields correctly", async () => {
      const input: CreateLeadInput = {
        nome: "Complete Test",
        email: "complete@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const expectedLead: Lead = {
        id: "complete-id",
        ...input,
        email: "complete@example.com", // Already normalized
        score: 180,
        priority: "Alto",
        created_at: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      const result = await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith({
        corretor_id: "corretor-test-id",
        nome: input.nome,
        email: input.email,
        cpf: input.cpf,
        telefone: input.telefone,
        valor_imovel: input.valor_imovel,
        renda_mensal: input.renda_mensal,
        score: 180,
        priority: "Alto",
      });

      expect(result).toEqual(expectedLead);
    });

    it("should maintain data types correctly", async () => {
      const input: CreateLeadInput = {
        nome: "Type Test",
        email: "type@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000.50, // Decimal
        renda_mensal: 12000.75,  // Decimal
      };

      const expectedLead: Lead = {
        id: "type-id",
        nome: "Type Test",
        email: "type@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000.50,
        renda_mensal: 12000.75,
        score: 180.01, // Calculated with decimals
        priority: "Alto",
        created_at: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          valor_imovel: 400000.50,
          renda_mensal: 12000.75,
          score: expect.any(Number),
        })
      );
    });
  });

  describe("Mock verification", () => {
    it("should call repository create exactly once", async () => {
      const input: CreateLeadInput = {
        nome: "Single Call",
        email: "single@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const expectedLead: Lead = {
        id: "single-id",
        nome: "Single Call",
        email: "single@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
        score: 180,
        priority: "Alto",
        created_at: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedLead);

      await create_lead(mockRepository, input, "corretor-test-id");

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.find_all).not.toHaveBeenCalled();
      expect(mockRepository.find_by_id).not.toHaveBeenCalled();
    });
  });
});


