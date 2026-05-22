import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../generated/prisma/client";

const create_prisma_client = () => {
  const connection_string = process.env.DATABASE_URL;
  if (!connection_string) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Copy .env.example to .env and fill in your credentials.",
    );
  }

  const adapter = new PrismaPg({
    connectionString: connection_string,
  });

  return new PrismaClient({ adapter });
};

// Singleton: reutiliza a instância em desenvolvimento para evitar
// múltiplas conexões causadas pelo hot reload do Next.js
const global_for_prisma = globalThis as unknown as {
  prisma: ReturnType<typeof create_prisma_client> | undefined
};

export const prisma =
  global_for_prisma.prisma ?? create_prisma_client();

if (process.env.NODE_ENV !== "production") {
  global_for_prisma.prisma = prisma;
}
