import { rank_leads, type SortOption } from "@/services/rank_leads";
import type { Lead } from "@/types/lead";

describe("rank_leads", () => {
  // Task 8.3: Unit tests for rank_leads function

  const mockLeads: Lead[] = [
    {
      id: "1",
      nome: "Ana Costa",
      email: "ana@example.com",
      cpf: "11144477735",
      telefone: "11999999999",
      valor_imovel: 400000,
      renda_mensal: 12000,
      score: 180,
      priority: "Alto",
      created_at: new Date("2024-01-01T10:00:00Z"),
    },
    {
      id: "2",
      nome: "Bruno Lima",
      email: "bruno@example.com",
      cpf: "22255588846",
      telefone: "11888888888",
      valor_imovel: 380000,
      renda_mensal: 6000,
      score: 94.74,
      priority: "Alto",
      created_at: new Date("2024-01-01T11:00:00Z"),
    },
    {
      id: "3",
      nome: "Carla Melo",
      email: "carla@example.com",
      cpf: "33366699957",
      telefone: "11777777777",
      valor_imovel: 450000,
      renda_mensal: 3000,
      score: 40,
      priority: "Medio",
      created_at: new Date("2024-01-01T12:00:00Z"),
    },
    {
      id: "4",
      nome: "David Silva",
      email: "david@example.com",
      cpf: "44477700068",
      telefone: "11666666666",
      valor_imovel: 500000,
      renda_mensal: 0,
      score: null,
      priority: "NaoClassificado",
      created_at: new Date("2024-01-01T13:00:00Z"),
    },
    {
      id: "5",
      nome: "Elena Santos",
      email: "elena@example.com",
      cpf: "55588811179",
      telefone: "11555555555",
      valor_imovel: 300000,
      renda_mensal: 8000,
      score: 200,
      priority: "Alto",
      created_at: new Date("2024-01-01T09:00:00Z"), // Earlier than Ana
    },
  ];

  describe("Sort by score (default)", () => {
    it("should sort leads by score in descending order", () => {
      const result = rank_leads(mockLeads, "score");

      expect(result).toHaveLength(5);
      expect(result[0].id).toBe("5"); // Elena - score 160
      expect(result[1].id).toBe("1"); // Ana - score 90
      expect(result[2].id).toBe("2"); // Bruno - score 57.89
      expect(result[3].id).toBe("3"); // Carla - score 24
      expect(result[4].id).toBe("4"); // David - no score (unclassified)
    });

    it("should use default sort by score when no sort option provided", () => {
      const result = rank_leads(mockLeads);

      expect(result[0].score).toBe(200); // Elena - score 200
      expect(result[1].score).toBe(180); // Ana - score 180
      expect(result[2].score).toBe(94.74); // Bruno - score 94.74
      expect(result[3].score).toBe(40); // Carla - score 40
      expect(result[4].score).toBe(null);
    });

    it("should handle leads with same score by creation date (newer first)", () => {
      const leadsWithSameScore: Lead[] = [
        {
          ...mockLeads[0],
          id: "same1",
          score: 80,
          created_at: new Date("2024-01-01T10:00:00Z"),
        },
        {
          ...mockLeads[1],
          id: "same2",
          score: 80,
          created_at: new Date("2024-01-01T12:00:00Z"), // Later
        },
      ];

      const result = rank_leads(leadsWithSameScore, "score");

      expect(result[0].id).toBe("same2"); // Later creation date first
      expect(result[1].id).toBe("same1");
    });

    it("should exclude unclassified leads from scored ranking", () => {
      const result = rank_leads(mockLeads, "score");
      const scoredLeads = result.filter(lead => lead.score !== null);
      const unclassifiedLeads = result.filter(lead => lead.score === null);

      expect(scoredLeads).toHaveLength(4);
      expect(unclassifiedLeads).toHaveLength(1);
      expect(unclassifiedLeads[0].priority).toBe("NaoClassificado");
    });
  });

  describe("Sort by priority", () => {
    it("should sort leads by priority order (Alto > Medio > Baixo > NaoClassificado)", () => {
      const result = rank_leads(mockLeads, "priority");

      expect(result[0].priority).toBe("Alto");   // Elena or Ana
      expect(result[1].priority).toBe("Alto");   // Ana or Elena or Bruno
      expect(result[2].priority).toBe("Alto");   // Bruno
      expect(result[3].priority).toBe("Medio");  // Carla
      expect(result[4].priority).toBe("NaoClassificado"); // David
    });

    it("should handle leads with same priority by creation date (newer first)", () => {
      const result = rank_leads(mockLeads, "priority");

      // Both Elena and Ana have "Alto" priority
      // Elena created at 09:00, Ana at 10:00, Bruno at 11:00 - Ana should come first (newer among Ana and Elena)
      const altoLeads = result.filter(lead => lead.priority === "Alto");
      expect(altoLeads[0].id).toBe("2"); // Bruno (11:00) - newest among Alto leads
      expect(altoLeads[1].id).toBe("1"); // Ana (10:00)
      expect(altoLeads[2].id).toBe("5"); // Elena (09:00) - oldest
    });

    it("should include all leads regardless of score when sorting by priority", () => {
      const result = rank_leads(mockLeads, "priority");

      expect(result).toHaveLength(5);
      expect(result.some(lead => lead.score === null)).toBe(true);
    });
  });

  describe("Sort by renda_mensal", () => {
    it("should sort leads by renda_mensal in descending order", () => {
      const result = rank_leads(mockLeads, "renda");

      expect(result[0].renda_mensal).toBe(12000); // Ana
      expect(result[1].renda_mensal).toBe(8000);  // Elena
      expect(result[2].renda_mensal).toBe(6000);  // Bruno
      expect(result[3].renda_mensal).toBe(3000);  // Carla
      expect(result[4].renda_mensal).toBe(0);     // David
    });

    it("should handle leads with same renda_mensal by creation date (newer first)", () => {
      const leadsWithSameRenda: Lead[] = [
        {
          ...mockLeads[0],
          id: "renda1",
          renda_mensal: 5000,
          created_at: new Date("2024-01-01T10:00:00Z"),
        },
        {
          ...mockLeads[1],
          id: "renda2",
          renda_mensal: 5000,
          created_at: new Date("2024-01-01T12:00:00Z"), // Later
        },
      ];

      const result = rank_leads(leadsWithSameRenda, "renda");

      expect(result[0].id).toBe("renda2"); // Later creation date first
      expect(result[1].id).toBe("renda1");
    });
  });

  describe("Sort by valor_imovel", () => {
    it("should sort leads by valor_imovel in descending order", () => {
      const result = rank_leads(mockLeads, "valor_imovel");

      expect(result[0].valor_imovel).toBe(500000); // David
      expect(result[1].valor_imovel).toBe(450000); // Carla
      expect(result[2].valor_imovel).toBe(400000); // Ana
      expect(result[3].valor_imovel).toBe(380000); // Bruno
      expect(result[4].valor_imovel).toBe(300000); // Elena
    });

    it("should handle leads with same valor_imovel by creation date (newer first)", () => {
      const leadsWithSameValor: Lead[] = [
        {
          ...mockLeads[0],
          id: "valor1",
          valor_imovel: 400000,
          created_at: new Date("2024-01-01T10:00:00Z"),
        },
        {
          ...mockLeads[1],
          id: "valor2",
          valor_imovel: 400000,
          created_at: new Date("2024-01-01T12:00:00Z"), // Later
        },
      ];

      const result = rank_leads(leadsWithSameValor, "valor_imovel");

      expect(result[0].id).toBe("valor2"); // Later creation date first
      expect(result[1].id).toBe("valor1");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty array", () => {
      const result = rank_leads([], "score");

      expect(result).toEqual([]);
    });

    it("should handle array with single lead", () => {
      const singleLead = [mockLeads[0]];
      const result = rank_leads(singleLead, "score");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockLeads[0]);
    });

    it("should handle all unclassified leads", () => {
      const unclassifiedLeads: Lead[] = [
        {
          ...mockLeads[3],
          id: "unclass1",
          created_at: new Date("2024-01-01T10:00:00Z"),
        },
        {
          ...mockLeads[3],
          id: "unclass2",
          created_at: new Date("2024-01-01T12:00:00Z"),
        },
      ];

      const result = rank_leads(unclassifiedLeads, "score");

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("unclass1"); // Earlier creation date first for unclassified
      expect(result[1].id).toBe("unclass2");
    });

    it("should handle all leads with same score", () => {
      const sameScoreLeads: Lead[] = mockLeads.slice(0, 3).map((lead, index) => ({
        ...lead,
        id: `same${index}`,
        score: 50,
        priority: "Medio" as const,
        created_at: new Date(`2024-01-01T${10 + index}:00:00Z`),
      }));

      const result = rank_leads(sameScoreLeads, "score");

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe("same2"); // Latest creation date
      expect(result[1].id).toBe("same1");
      expect(result[2].id).toBe("same0"); // Earliest creation date
    });

    it("should not mutate original array", () => {
      const originalLeads = [...mockLeads];
      const result = rank_leads(mockLeads, "score");

      expect(mockLeads).toEqual(originalLeads);
      expect(result).not.toBe(mockLeads); // Different array reference
    });

    it("should handle invalid sort option gracefully", () => {
      // TypeScript should prevent this, but testing runtime behavior
      const result = rank_leads(mockLeads, "invalid" as SortOption);

      // Should fall through to default case (score sorting) and filter out unclassified leads
      expect(result).toHaveLength(4); // Only scored leads
      expect(result.every(lead => lead.score !== null)).toBe(true);
    });
  });

  describe("Type safety", () => {
    it("should maintain lead object structure", () => {
      const result = rank_leads(mockLeads, "score");

      result.forEach(lead => {
        expect(lead).toHaveProperty("id");
        expect(lead).toHaveProperty("nome");
        expect(lead).toHaveProperty("email");
        expect(lead).toHaveProperty("cpf");
        expect(lead).toHaveProperty("telefone");
        expect(lead).toHaveProperty("valor_imovel");
        expect(lead).toHaveProperty("renda_mensal");
        expect(lead).toHaveProperty("score");
        expect(lead).toHaveProperty("priority");
        expect(lead).toHaveProperty("created_at");
      });
    });

    it("should preserve all lead data during sorting", () => {
      const result = rank_leads(mockLeads, "score");

      // Check that all original leads are present
      mockLeads.forEach(originalLead => {
        const foundLead = result.find(lead => lead.id === originalLead.id);
        expect(foundLead).toEqual(originalLead);
      });
    });
  });
});