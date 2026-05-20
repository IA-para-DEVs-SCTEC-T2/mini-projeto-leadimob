import fc from "fast-check";

import { calculate_lead_score } from "@/domain/rules/calculate_lead_score";

describe("calculate_lead_score", () => {
  // Task 5.2: Property-based tests for calculate_lead_score function
  describe("Property-based tests", () => {
    it("should always return valid=false when valor_imovel is null or zero", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant(null), fc.constant(0), fc.float({ max: 0 }).filter(x => !isNaN(x) && isFinite(x))),
          fc.oneof(fc.constant(null), fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }).filter(x => !isNaN(x) && isFinite(x))),
          (valor_imovel, renda_mensal) => {
            const result = calculate_lead_score(renda_mensal, valor_imovel);
            return !result.valid && result.priority === "NaoClassificado";
          },
        ),
      );
    });

    it("should always return valid=false when renda_mensal is null or zero", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant(null), fc.constant(0), fc.float({ max: 0 }).filter(x => !isNaN(x) && isFinite(x))),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }).filter(x => !isNaN(x) && isFinite(x)),
          (renda_mensal, valor_imovel) => {
            const result = calculate_lead_score(renda_mensal, valor_imovel);
            return !result.valid && result.priority === "NaoClassificado";
          },
        ),
      );
    });

    it("should always return valid=true when both inputs are positive", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }),
          (renda_mensal, valor_imovel) => {
            const result = calculate_lead_score(renda_mensal, valor_imovel);
            return result.valid;
          },
        ),
      );
    });

    it("should return score >= 80 implies priority Alto", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }),
          (renda_mensal, valor_imovel) => {
            const result = calculate_lead_score(renda_mensal, valor_imovel);
            if (result.valid && result.score >= 80) {
              return result.priority === "Alto";
            }
            return true;
          },
        ),
      );
    });

    it("should return score between 40-79 implies priority Medio", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }),
          (renda_mensal, valor_imovel) => {
            const result = calculate_lead_score(renda_mensal, valor_imovel);
            if (result.valid && result.score >= 40 && result.score < 80) {
              return result.priority === "Medio";
            }
            return true;
          },
        ),
      );
    });

    it("should return score < 40 implies priority Baixo", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }),
          (renda_mensal, valor_imovel) => {
            const result = calculate_lead_score(renda_mensal, valor_imovel);
            if (result.valid && result.score < 40) {
              return result.priority === "Baixo";
            }
            return true;
          },
        ),
      );
    });

    it("should be monotonic: higher renda_mensal should yield higher or equal score", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(50000) }).filter(x => !isNaN(x) && isFinite(x)),
          fc.float({ min: Math.fround(0.01), max: Math.fround(50000) }).filter(x => !isNaN(x) && isFinite(x)),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }).filter(x => !isNaN(x) && isFinite(x)),
          (renda1, renda2, valor_imovel) => {
            fc.pre(renda1 <= renda2 && !isNaN(renda1) && !isNaN(renda2) && !isNaN(valor_imovel));

            const result1 = calculate_lead_score(renda1, valor_imovel);
            const result2 = calculate_lead_score(renda2, valor_imovel);

            if (result1.valid && result2.valid) {
              return result1.score <= result2.score;
            }
            return true;
          },
        ),
      );
    });

    it("should be inversely monotonic: higher valor_imovel should yield lower or equal score", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(500000) }),
          fc.float({ min: Math.fround(0.01), max: Math.fround(500000) }),
          (renda_mensal, valor1, valor2) => {
            fc.pre(valor1 <= valor2);

            const result1 = calculate_lead_score(renda_mensal, valor1);
            const result2 = calculate_lead_score(renda_mensal, valor2);

            if (result1.valid && result2.valid) {
              return result1.score >= result2.score;
            }
            return true;
          },
        ),
      );
    });

    it("should always return score >= 0 when valid", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }).filter(x => !isNaN(x) && isFinite(x)),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }).filter(x => !isNaN(x) && isFinite(x)),
          (renda_mensal, valor_imovel) => {
            fc.pre(!isNaN(renda_mensal) && !isNaN(valor_imovel));

            const result = calculate_lead_score(renda_mensal, valor_imovel);
            if (result.valid) {
              return result.score >= 0;
            }
            return true;
          },
        ),
      );
    });

    it("should maintain formula consistency: score = (renda * 12 * 5) / valor * 100", () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.01), max: Math.fround(100000) }).filter(x => !isNaN(x) && isFinite(x)),
          fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) }).filter(x => !isNaN(x) && isFinite(x)),
          (renda_mensal, valor_imovel) => {
            fc.pre(!isNaN(renda_mensal) && !isNaN(valor_imovel) && isFinite(renda_mensal) && isFinite(valor_imovel));

            const result = calculate_lead_score(renda_mensal, valor_imovel);
            if (result.valid) {
              const expected_score = Math.round(((renda_mensal * 12 * 5) / valor_imovel) * 100 * 100) / 100;
              return Math.abs(result.score - expected_score) < 0.01;
            }
            return true;
          },
        ),
      );
    });
  });
  // Task 5.3: Unit tests for calculate_lead_score function
  describe("Unit tests", () => {
    describe("Invalid inputs", () => {
      it("should return invalid result when valor_imovel is null", () => {
        const result = calculate_lead_score(5000, null);

        expect(result).toEqual({
          valid: false,
          priority: "NaoClassificado",
        });
      });

      it("should return invalid result when valor_imovel is zero", () => {
        const result = calculate_lead_score(5000, 0);

        expect(result).toEqual({
          valid: false,
          priority: "NaoClassificado",
        });
      });

      it("should return invalid result when valor_imovel is negative", () => {
        const result = calculate_lead_score(5000, -100000);

        expect(result).toEqual({
          valid: false,
          priority: "NaoClassificado",
        });
      });

      it("should return invalid result when renda_mensal is null", () => {
        const result = calculate_lead_score(null, 400000);

        expect(result).toEqual({
          valid: false,
          priority: "NaoClassificado",
        });
      });

      it("should return invalid result when renda_mensal is zero", () => {
        const result = calculate_lead_score(0, 400000);

        expect(result).toEqual({
          valid: false,
          priority: "NaoClassificado",
        });
      });

      it("should return invalid result when renda_mensal is negative", () => {
        const result = calculate_lead_score(-5000, 400000);

        expect(result).toEqual({
          valid: false,
          priority: "NaoClassificado",
        });
      });

      it("should return invalid result when both inputs are null", () => {
        const result = calculate_lead_score(null, null);

        expect(result).toEqual({
          valid: false,
          priority: "NaoClassificado",
        });
      });
    });

    describe("Valid inputs - Priority Alto (score >= 80)", () => {
      it("should return Alto priority for high income vs property value (score = 180)", () => {
        // renda: 12000, valor: 400000
        // score = (12000 * 12 * 5) / 400000 * 100 = 180
        const result = calculate_lead_score(12000, 400000);

        expect(result).toEqual({
          valid: true,
          score: 180,
          priority: "Alto",
        });
      });

      it("should return Alto priority for edge case (score = 96)", () => {
        // renda: 8000, valor: 500000
        // score = (8000 * 12 * 5) / 500000 * 100 = 96
        const result = calculate_lead_score(8000, 500000);

        expect(result).toEqual({
          valid: true,
          score: 96,
          priority: "Alto",
        });
      });

      it("should return Alto priority for very high score (score = 300)", () => {
        // renda: 15000, valor: 300000
        // score = (15000 * 12 * 5) / 300000 * 100 = 300
        const result = calculate_lead_score(15000, 300000);

        expect(result).toEqual({
          valid: true,
          score: 300,
          priority: "Alto",
        });
      });
    });

    describe("Valid inputs - Priority Medio (40 <= score < 80)", () => {
      it("should return Medio priority for moderate income vs property value (score = 47.37)", () => {
        // renda: 3000, valor: 380000
        // score = (3000 * 12 * 5) / 380000 * 100 = 47.37
        const result = calculate_lead_score(3000, 380000);

        expect(result).toEqual({
          valid: true,
          score: 47.37,
          priority: "Medio",
        });
      });

      it("should return Medio priority for edge case (score = 48)", () => {
        // renda: 4000, valor: 500000
        // score = (4000 * 12 * 5) / 500000 * 100 = 48
        const result = calculate_lead_score(4000, 500000);

        expect(result).toEqual({
          valid: true,
          score: 48,
          priority: "Medio",
        });
      });

      it("should return Medio priority for upper edge case (score = 79.99)", () => {
        // renda: 6666, valor: 500000
        // score = (6666 * 12 * 5) / 500000 * 100 = 79.99
        const result = calculate_lead_score(6666, 500000);

        expect(result).toEqual({
          valid: true,
          score: 79.99,
          priority: "Medio",
        });
      });
    });

    describe("Valid inputs - Priority Baixo (score < 40)", () => {
      it("should return Baixo priority for low income vs property value (score = 26.67)", () => {
        // renda: 2000, valor: 450000
        // score = (2000 * 12 * 5) / 450000 * 100 = 26.67
        const result = calculate_lead_score(2000, 450000);

        expect(result).toEqual({
          valid: true,
          score: 26.67,
          priority: "Baixo",
        });
      });

      it("should return Baixo priority for very low score (score = 12)", () => {
        // renda: 2000, valor: 1000000
        // score = (2000 * 12 * 5) / 1000000 * 100 = 12
        const result = calculate_lead_score(2000, 1000000);

        expect(result).toEqual({
          valid: true,
          score: 12,
          priority: "Baixo",
        });
      });

      it("should return Baixo priority for edge case (score = 39.99)", () => {
        // renda: 3332.5, valor: 500000
        // score = (3332.5 * 12 * 5) / 500000 * 100 = 39.99
        const result = calculate_lead_score(3332.5, 500000);

        expect(result).toEqual({
          valid: true,
          score: 39.99,
          priority: "Baixo",
        });
      });
    });

    describe("Decimal precision", () => {
      it("should handle decimal inputs correctly", () => {
        // renda: 5500.50, valor: 350000.75
        // score = (5500.50 * 12 * 5) / 350000.75 * 100 ≈ 94.29
        const result = calculate_lead_score(5500.50, 350000.75);

        expect(result.valid).toBe(true);
        expect(result.score).toBeCloseTo(94.29, 2);
        expect(result.priority).toBe("Alto");
      });

      it("should round score to 2 decimal places", () => {
        // Test case that would produce more than 2 decimal places
        // renda: 3333, valor: 500000
        // score = (3333 * 12 * 5) / 500000 * 100 = 39.996 -> rounds to 40.00
        const result = calculate_lead_score(3333, 500000);

        expect(result.valid).toBe(true);
        expect(result.score).toBe(40); // Should be rounded to 2 decimal places
        expect(result.priority).toBe("Medio");
      });
    });

    describe("Edge cases", () => {
      it("should handle very small positive values", () => {
        const result = calculate_lead_score(0.01, 0.01);

        expect(result.valid).toBe(true);
        expect(result.score).toBe(6000); // (0.01 * 12 * 5) / 0.01 * 100
        expect(result.priority).toBe("Alto");
      });

      it("should handle very large values", () => {
        const result = calculate_lead_score(1000000, 10000000);

        expect(result.valid).toBe(true);
        expect(result.score).toBe(600); // (1000000 * 12 * 5) / 10000000 * 100
        expect(result.priority).toBe("Alto");
      });
    });
  });
});