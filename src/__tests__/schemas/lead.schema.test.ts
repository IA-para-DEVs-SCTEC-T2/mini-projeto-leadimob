import fc from "fast-check";
import { CreateLeadSchema } from "@/schemas/lead.schema";

describe("CreateLeadSchema", () => {
  // Feature: leadimobi-core, Property 7: Rejeição de entradas inválidas pelo schema Zod
  describe("Property 7: Rejeição de entradas inválidas", () => {
    it("should reject nome with less than 2 characters", () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 1 }), (nome) => {
          const result = CreateLeadSchema.safeParse({
            nome,
            email: "test@example.com",
            cpf: "12345678901",
            telefone: "1234567890",
            valor_imovel: 100000,
            renda_mensal: 5000,
          });

          return !result.success;
        })
      );
    });

    it("should reject email without @", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }).filter((s) => !s.includes("@")), (email) => {
          const result = CreateLeadSchema.safeParse({
            nome: "John Doe",
            email,
            cpf: "12345678901",
            telefone: "1234567890",
            valor_imovel: 100000,
            renda_mensal: 5000,
          });

          return !result.success;
        })
      );
    });

    it("should reject CPF with less than 11 digits", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 }).chain((len) =>
            fc.tuple(
              fc.constant(len),
              fc.stringMatching(/^\d{0,10}$/)
            )
          ),
          ([len, cpf]) => {
            if (cpf.length !== len) return true; // Skip if length doesn't match

            const result = CreateLeadSchema.safeParse({
              nome: "John Doe",
              email: "test@example.com",
              cpf,
              telefone: "1234567890",
              valor_imovel: 100000,
              renda_mensal: 5000,
            });

            return !result.success;
          }
        )
      );
    });

    it("should reject CPF with more than 11 digits", () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^\d{12,}$/),
          (cpf) => {
            const result = CreateLeadSchema.safeParse({
              nome: "John Doe",
              email: "test@example.com",
              cpf,
              telefone: "1234567890",
              valor_imovel: 100000,
              renda_mensal: 5000,
            });

            return !result.success;
          }
        )
      );
    });

    it("should reject telefone with less than 10 digits", () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^\d{0,9}$/),
          (telefone) => {
            const result = CreateLeadSchema.safeParse({
              nome: "John Doe",
              email: "test@example.com",
              cpf: "12345678901",
              telefone,
              valor_imovel: 100000,
              renda_mensal: 5000,
            });

            return !result.success;
          }
        )
      );
    });

    it("should reject valor_imovel <= 0", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant(0), fc.float({ max: 0 })),
          (valor_imovel) => {
            const result = CreateLeadSchema.safeParse({
              nome: "John Doe",
              email: "test@example.com",
              cpf: "12345678901",
              telefone: "1234567890",
              valor_imovel,
              renda_mensal: 5000,
            });

            return !result.success;
          }
        )
      );
    });

    it("should reject renda_mensal <= 0", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant(0), fc.float({ max: 0 })),
          (renda_mensal) => {
            const result = CreateLeadSchema.safeParse({
              nome: "John Doe",
              email: "test@example.com",
              cpf: "12345678901",
              telefone: "1234567890",
              valor_imovel: 100000,
              renda_mensal,
            });

            return !result.success;
          }
        )
      );
    });
  });

  // Feature: leadimobi-core, Property 8: Aceitação de entradas válidas pelo schema Zod
  describe("Property 8: Aceitação de entradas válidas", () => {
    it("should accept valid input with all fields correct", () => {
      const validData = {
        nome: "John Doe",
        email: "john@example.com",
        cpf: "12345678901",
        telefone: "1234567890",
        valor_imovel: 400000,
        renda_mensal: 12000,
      };

      const result = CreateLeadSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nome).toBe("John Doe");
        expect(result.data.email).toBe("john@example.com");
        expect(result.data.cpf).toBe("12345678901");
      }
    });

    it("should accept CPF with formatting and extract digits", () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^\d{11}$/),
          (cpf_digits) => {
            // Format CPF: 000.000.000-00
            const formatted_cpf = `${cpf_digits.slice(0, 3)}.${cpf_digits.slice(3, 6)}.${cpf_digits.slice(6, 9)}-${cpf_digits.slice(9)}`;

            const result = CreateLeadSchema.safeParse({
              nome: "John Doe",
              email: "test@example.com",
              cpf: formatted_cpf,
              telefone: "1234567890",
              valor_imovel: 100000,
              renda_mensal: 5000,
            });

            return result.success;
          }
        )
      );
    });

    it("should accept telefone with formatting and extract digits", () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^\d{10,15}$/),
          (telefone_digits) => {
            // Format telefone: (XX) XXXXX-XXXX
            const formatted_telefone = `(${telefone_digits.slice(0, 2)}) ${telefone_digits.slice(2, 7)}-${telefone_digits.slice(7)}`;

            const result = CreateLeadSchema.safeParse({
              nome: "John Doe",
              email: "test@example.com",
              cpf: "12345678901",
              telefone: formatted_telefone,
              valor_imovel: 100000,
              renda_mensal: 5000,
            });

            return result.success;
          }
        )
      );
    });
  });

  // Unit tests for specific cases
  describe("Unit tests for specific cases", () => {
    it("should reject nome with 1 character", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "A",
        email: "test@example.com",
        cpf: "12345678901",
        telefone: "1234567890",
        valor_imovel: 100000,
        renda_mensal: 5000,
      });

      expect(result.success).toBe(false);
    });

    it("should accept nome with 2 characters", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "AB",
        email: "test@example.com",
        cpf: "12345678901",
        telefone: "1234567890",
        valor_imovel: 100000,
        renda_mensal: 5000,
      });

      expect(result.success).toBe(true);
    });

    it("should reject email without @", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "John Doe",
        email: "testexample.com",
        cpf: "12345678901",
        telefone: "1234567890",
        valor_imovel: 100000,
        renda_mensal: 5000,
      });

      expect(result.success).toBe(false);
    });

    it("should reject CPF with 10 digits", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "John Doe",
        email: "test@example.com",
        cpf: "1234567890",
        telefone: "1234567890",
        valor_imovel: 100000,
        renda_mensal: 5000,
      });

      expect(result.success).toBe(false);
    });

    it("should accept CPF with 11 digits", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "John Doe",
        email: "test@example.com",
        cpf: "12345678901",
        telefone: "1234567890",
        valor_imovel: 100000,
        renda_mensal: 5000,
      });

      expect(result.success).toBe(true);
    });

    it("should reject telefone with 9 digits", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "John Doe",
        email: "test@example.com",
        cpf: "12345678901",
        telefone: "123456789",
        valor_imovel: 100000,
        renda_mensal: 5000,
      });

      expect(result.success).toBe(false);
    });

    it("should reject valor_imovel negative", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "John Doe",
        email: "test@example.com",
        cpf: "12345678901",
        telefone: "1234567890",
        valor_imovel: -100000,
        renda_mensal: 5000,
      });

      expect(result.success).toBe(false);
    });

    it("should reject renda_mensal zero", () => {
      const result = CreateLeadSchema.safeParse({
        nome: "John Doe",
        email: "test@example.com",
        cpf: "12345678901",
        telefone: "1234567890",
        valor_imovel: 100000,
        renda_mensal: 0,
      });

      expect(result.success).toBe(false);
    });
  });
});
