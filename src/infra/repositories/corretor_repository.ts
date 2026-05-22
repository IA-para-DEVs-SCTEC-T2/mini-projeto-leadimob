import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/infra/db/prisma";
import type { Corretor, CorretorWithHash } from "@/types/corretor";

type RepositoryError = {
  error: "EMAIL_ALREADY_EXISTS" | "DATABASE_UNAVAILABLE"
}

function is_repository_error(error: unknown): error is RepositoryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    (error.error === "EMAIL_ALREADY_EXISTS" ||
      error.error === "DATABASE_UNAVAILABLE")
  );
}

function handle_repository_error(error: unknown): never {
  if (is_repository_error(error)) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // P2002 is unique constraint violation
      const target = error.meta?.target as string[] | undefined;

      // Check both target array and error message for email field
      const isEmailError =
        target?.includes("email") ??
        error.message?.includes("email") ??
        error.message?.includes("corretores_email_key");

      if (isEmailError) {
        throw { error: "EMAIL_ALREADY_EXISTS" } satisfies RepositoryError;
      }
    }
  }

  console.error("[corretor_repository] Unhandled error:", error);
  throw { error: "DATABASE_UNAVAILABLE" } satisfies RepositoryError;
}

async function create(data: {
  nome: string
  email: string
  telefone?: string
  password_hash: string
}): Promise<Corretor> {
  try {
    const corretor = await prisma.corretor.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone ?? null,
        password_hash: data.password_hash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        created_at: true,
      },
    });

    return corretor;
  } catch (error) {
    handle_repository_error(error);
  }
}

async function find_by_email(email: string): Promise<CorretorWithHash | null> {
  try {
    const corretor = await prisma.corretor.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        password_hash: true,
        created_at: true,
      },
    });

    return corretor;
  } catch (error) {
    handle_repository_error(error);
  }
}

async function find_by_id(id: string): Promise<Corretor | null> {
  try {
    const corretor = await prisma.corretor.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        created_at: true,
      },
    });

    return corretor;
  } catch (error) {
    handle_repository_error(error);
  }
}

export const corretor_repository = {
  create,
  find_by_email,
  find_by_id,
};
