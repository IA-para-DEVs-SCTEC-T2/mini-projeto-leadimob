import { create_lead } from "@/services/create_lead";
import { list_leads } from "@/services/list_leads";
import type { CreateLeadInput, Lead, LeadRepository } from "@/types/lead";

describe("List consistency after lead creation", () => {
  // Task 8.7: Integration test for list consistency after lead creation

  let mockRepository: jest.Mocked<LeadRepository>;
  let mockLeads: Lead[];

  beforeEach(() => {
    mockLeads = [];

    mockRepository = {
      create: jest.fn().mockImplementation(async (data) => {
        const newLead: Lead = {
          id: `generated-id-${mockLeads.length + 1}`,
          ...data,
          created_at: new Date(),
        };
        mockLeads.push(newLead);
        return newLead;
      }),
      find_all: jest.fn().mockImplementation(async () => {
        return mockLeads.map(lead => ({ ...lead })); // Return deep copies to avoid mutation
      }),
      find_by_id: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockLeads = [];
  });

  describe("Single lead creation and listing", () => {
    it("should include newly created lead in list", async () => {
      const input: CreateLeadInput = {
        nome: "Ana Costa",
        email: "ana@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      // Create lead
      const createdLead = await create_lead(mockRepository, input);

      // List leads
      const leadsList = await list_leads(mockRepository);

      expect(leadsList).toHaveLength(1);
      expect(leadsList[0]).toEqual(createdLead);
      expect(leadsList[0].id).toBe(createdLead.id);
      expect(leadsList[0].nome).toBe("Ana Costa");
      expect(leadsList[0].score).toBe(180);
      expect(leadsList[0].priority).toBe("Alto");
    });

    it("should maintain lead data integrity after creation and listing", async () => {
      const input: CreateLeadInput = {
        nome: "Bruno Lima",
        email: "BRUNO@EXAMPLE.COM", // Test email normalization
        cpf: "22255588846",
        telefone: "11888888888",
        valor_imovel: 380000,
        renda_mensal: 6000,
      };

      await create_lead(mockRepository, input);
      const leadsList = await list_leads(mockRepository);

      const listedLead = leadsList[0];

      // Verify all fields match
      expect(listedLead.nome).toBe(input.nome);
      expect(listedLead.email).toBe("bruno@example.com"); // Should be normalized
      expect(listedLead.cpf).toBe(input.cpf);
      expect(listedLead.telefone).toBe(input.telefone);
      expect(listedLead.valor_imovel).toBe(input.valor_imovel);
      expect(listedLead.renda_mensal).toBe(input.renda_mensal);
      expect(listedLead.score).toBe(94.74);
      expect(listedLead.priority).toBe("Alto");
      expect(listedLead.created_at).toBeInstanceOf(Date);
    });
  });

  describe("Multiple leads creation and ordering", () => {
    it("should maintain correct order by score after multiple creations", async () => {
      const inputs: CreateLeadInput[] = [
        {
          nome: "Carla Melo",
          email: "carla@example.com",
          cpf: "33366699957",
          telefone: "11777777777",
          valor_imovel: 450000,
          renda_mensal: 3000, // Score: 40 (Medio)
        },
        {
          nome: "Ana Costa",
          email: "ana@example.com",
          cpf: "11144477735",
          telefone: "11999999999",
          valor_imovel: 400000,
          renda_mensal: 12000, // Score: 180 (Alto)
        },
        {
          nome: "Bruno Lima",
          email: "bruno@example.com",
          cpf: "22255588846",
          telefone: "11888888888",
          valor_imovel: 380000,
          renda_mensal: 6000, // Score: 94.74 (Alto)
        },
      ];

      // Create leads in order: Baixo, Alto, Medio
      for (const input of inputs) {
        await create_lead(mockRepository, input);
      }

      // List leads (should be ordered by score: Alto, Alto, Medio)
      const leadsList = await list_leads(mockRepository, "score");

      expect(leadsList).toHaveLength(3);
      expect(leadsList[0].nome).toBe("Ana Costa");   // Score: 180
      expect(leadsList[1].nome).toBe("Bruno Lima");  // Score: 94.74
      expect(leadsList[2].nome).toBe("Carla Melo"); // Score: 40
    });

    it("should handle mixed valid and invalid leads correctly", async () => {
      const inputs: CreateLeadInput[] = [
        {
          nome: "Valid Lead",
          email: "valid@example.com",
          cpf: "11144477735",
          telefone: "11999999999",
          valor_imovel: 400000,
          renda_mensal: 12000, // Valid score
        },
        {
          nome: "Invalid Lead",
          email: "invalid@example.com",
          cpf: "22255588846",
          telefone: "11888888888",
          valor_imovel: 0, // Invalid - will be unclassified
          renda_mensal: 5000,
        },
        {
          nome: "Another Valid",
          email: "another@example.com",
          cpf: "33366699957",
          telefone: "11777777777",
          valor_imovel: 300000,
          renda_mensal: 8000, // Valid score: 160
        },
      ];

      for (const input of inputs) {
        await create_lead(mockRepository, input);
      }

      const leadsList = await list_leads(mockRepository, "score");

      expect(leadsList).toHaveLength(3);

      // Valid leads should come first, ordered by score
      expect(leadsList[0].nome).toBe("Valid Lead"); // Higher score: 180
      expect(leadsList[0].score).toBe(180);
      expect(leadsList[1].nome).toBe("Another Valid"); // Lower score: 160
      expect(leadsList[1].score).toBe(160);

      // Unclassified lead should come last
      expect(leadsList[2].nome).toBe("Invalid Lead");
      expect(leadsList[2].score).toBe(null);
      expect(leadsList[2].priority).toBe("NaoClassificado");
    });
  });

  describe("Different sorting options consistency", () => {
    beforeEach(async () => {
      const inputs: CreateLeadInput[] = [
        {
          nome: "Ana Costa",
          email: "ana@example.com",
          cpf: "11144477735",
          telefone: "11999999999",
          valor_imovel: 400000,
          renda_mensal: 12000,
        },
        {
          nome: "Bruno Lima",
          email: "bruno@example.com",
          cpf: "22255588846",
          telefone: "11888888888",
          valor_imovel: 380000,
          renda_mensal: 6000,
        },
        {
          nome: "Carla Melo",
          email: "carla@example.com",
          cpf: "33366699957",
          telefone: "11777777777",
          valor_imovel: 450000,
          renda_mensal: 3000,
        },
      ];

      for (const input of inputs) {
        await create_lead(mockRepository, input);
      }
    });

    it("should maintain consistency when sorting by priority", async () => {
      const leadsList = await list_leads(mockRepository, "priority");

      expect(leadsList).toHaveLength(3);
      expect(leadsList[0].priority).toBe("Alto");   // Ana
      expect(leadsList[1].priority).toBe("Alto");  // Bruno
      expect(leadsList[2].priority).toBe("Medio"); // Carla
    });

    it("should maintain consistency when sorting by renda", async () => {
      const leadsList = await list_leads(mockRepository, "renda");

      expect(leadsList).toHaveLength(3);
      expect(leadsList[0].renda_mensal).toBe(12000); // Ana
      expect(leadsList[1].renda_mensal).toBe(6000);  // Bruno
      expect(leadsList[2].renda_mensal).toBe(3000);  // Carla
    });

    it("should maintain consistency when sorting by valor_imovel", async () => {
      const leadsList = await list_leads(mockRepository, "valor_imovel");

      expect(leadsList).toHaveLength(3);
      expect(leadsList[0].valor_imovel).toBe(450000); // Carla
      expect(leadsList[1].valor_imovel).toBe(400000); // Ana
      expect(leadsList[2].valor_imovel).toBe(380000); // Bruno
    });
  });

  describe("Repository interaction consistency", () => {
    it("should call repository methods in correct sequence", async () => {
      const input: CreateLeadInput = {
        nome: "Test Lead",
        email: "test@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      // Create lead
      await create_lead(mockRepository, input);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);

      // List leads
      await list_leads(mockRepository);
      expect(mockRepository.find_all).toHaveBeenCalledTimes(1);

      // Verify create was called before find_all
      const createCall = mockRepository.create.mock.invocationCallOrder[0];
      const findAllCall = mockRepository.find_all.mock.invocationCallOrder[0];
      expect(createCall).toBeLessThan(findAllCall);
    });

    it("should handle repository errors consistently", async () => {
      const input: CreateLeadInput = {
        nome: "Error Test",
        email: "error@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      // Mock repository error on create
      const repositoryError = { error: "CPF_ALREADY_EXISTS" as const };
      mockRepository.create.mockRejectedValueOnce(repositoryError);

      // Create should fail
      await expect(create_lead(mockRepository, input)).rejects.toEqual(repositoryError);

      // List should still work (empty list)
      const leadsList = await list_leads(mockRepository);
      expect(leadsList).toHaveLength(0);
    });

    it("should handle find_all errors consistently", async () => {
      const input: CreateLeadInput = {
        nome: "Find Error Test",
        email: "finderror@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      // Create should succeed
      await create_lead(mockRepository, input);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);

      // Mock repository error on find_all
      const repositoryError = { error: "DATABASE_UNAVAILABLE" as const };
      mockRepository.find_all.mockRejectedValueOnce(repositoryError);

      // List should fail
      await expect(list_leads(mockRepository)).rejects.toEqual(repositoryError);
    });
  });

  describe("Data immutability", () => {
    it("should not mutate created lead when listing", async () => {
      const input: CreateLeadInput = {
        nome: "Immutable Test",
        email: "immutable@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const createdLead = await create_lead(mockRepository, input);
      const originalLead = { ...createdLead };

      await list_leads(mockRepository);

      // Verify created lead wasn't mutated
      expect(createdLead).toEqual(originalLead);
    });

    it("should return independent copies in list", async () => {
      const input: CreateLeadInput = {
        nome: "Copy Test",
        email: "copy@example.com",
        cpf: "11144477735",
        telefone: "11999999999",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      await create_lead(mockRepository, input);

      const leadsList1 = await list_leads(mockRepository);
      const leadsList2 = await list_leads(mockRepository);

      // Lists should be equal but not the same reference
      expect(leadsList1).toEqual(leadsList2);
      expect(leadsList1).not.toBe(leadsList2);

      // Individual leads should be equal but not the same reference
      expect(leadsList1[0]).toEqual(leadsList2[0]);
      expect(leadsList1[0]).not.toBe(leadsList2[0]);
    });
  });

  describe("Performance and efficiency", () => {
    it("should handle multiple operations efficiently", async () => {
      const inputs: CreateLeadInput[] = Array.from({ length: 10 }, (_, i) => ({
        nome: `Lead ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        cpf: `1114447773${i}`,
        telefone: `1199999999${i}`,
        valor_imovel: 400000 + (i * 10000),
        renda_mensal: 5000 + (i * 1000),
      }));

      // Create multiple leads
      for (const input of inputs) {
        await create_lead(mockRepository, input);
      }

      // List should contain all leads
      const leadsList = await list_leads(mockRepository);
      expect(leadsList).toHaveLength(10);

      // Verify repository was called correct number of times
      expect(mockRepository.create).toHaveBeenCalledTimes(10);
      expect(mockRepository.find_all).toHaveBeenCalledTimes(1);

      // Verify leads are properly ordered by score
      for (let i = 0; i < leadsList.length - 1; i++) {
        const currentLead = leadsList[i];
        const nextLead = leadsList[i + 1];

        if (currentLead.score !== null && nextLead.score !== null) {
          expect(currentLead.score).toBeGreaterThanOrEqual(nextLead.score);
        }
      }
    });
  });
});