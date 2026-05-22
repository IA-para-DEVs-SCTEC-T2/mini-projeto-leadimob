import type { Lead as PrismaLead } from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/infra/db/prisma";
import type {
  CreateLeadData,
  Lead,
  LeadPriority,
  LeadRepository,
  UpdateLeadData,
} from "@/types/lead";

type RepositoryError = {
  error: "CPF_ALREADY_EXISTS" | "DATABASE_UNAVAILABLE";
};

function map_priority(priority: string): LeadPriority {
  switch (priority) {
  case "Alto":
  case "Medio":
  case "Baixo":
  case "NaoClassificado":
    return priority;
  default:
    throw { error: "DATABASE_UNAVAILABLE" } satisfies RepositoryError;
  }
}

function map_prisma_to_lead(prisma_lead: PrismaLead): Lead {
  return {
    id: prisma_lead.id,
    nome: prisma_lead.nome,
    email: prisma_lead.email,
    cpf: prisma_lead.cpf,
    telefone: prisma_lead.telefone,
    valor_imovel: prisma_lead.valor_imovel.toNumber(),
    renda_mensal: prisma_lead.renda_mensal.toNumber(),
    score: prisma_lead.score?.toNumber() ?? null,
    priority: map_priority(prisma_lead.priority),
    created_at: prisma_lead.created_at,
  };
}

function is_repository_error(error: unknown): error is RepositoryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    (error.error === "CPF_ALREADY_EXISTS" ||
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

      // Check both target array and error message for CPF field
      // Constraint name changed from leads_cpf_key to leads_cpf_corretor_id_key after migration
      const isCpfError = target?.includes("cpf") || 
                        error.message?.includes("cpf") ||
                        error.message?.includes("leads_cpf_key") ||
                        error.message?.includes("leads_cpf_corretor_id_key");
      
      if (isCpfError) {
        throw { error: "CPF_ALREADY_EXISTS" } satisfies RepositoryError;
      }
    }
  }

  throw { error: "DATABASE_UNAVAILABLE" } satisfies RepositoryError;
}

async function create(data: CreateLeadData): Promise<Lead> {
  try {
    const lead = await prisma.lead.create({
      data,
    });

    return map_prisma_to_lead(lead);
  } catch (error) {
    handle_repository_error(error);
  }
}

async function find_all(corretor_id: string): Promise<Lead[]> {
  try {
    const leads = await prisma.lead.findMany({
      where: { corretor_id },
      orderBy: { created_at: 'desc' },
    });

    return leads.map(map_prisma_to_lead);
  } catch (error) {
    handle_repository_error(error);
  }
}

async function find_by_id(id: string, corretor_id: string): Promise<Lead | null> {
  try {
    const lead = await prisma.lead.findFirst({
      where: { id, corretor_id },
    });

    return lead === null ? null : map_prisma_to_lead(lead);
  } catch (error) {
    handle_repository_error(error);
  }
}

async function update(id: string, corretor_id: string, data: UpdateLeadData): Promise<Lead> {
  try {
    const result = await prisma.lead.updateMany({
      where: { id, corretor_id },
      data: {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        telefone: data.telefone,
        valor_imovel: data.valor_imovel,
        renda_mensal: data.renda_mensal,
        score: data.score,
        priority: data.priority,
      },
    });

    if (result.count === 0) {
      throw { error: "DATABASE_UNAVAILABLE" } satisfies RepositoryError;
    }

    const lead = await prisma.lead.findFirst({ where: { id, corretor_id } });
    if (!lead) {
      throw { error: "DATABASE_UNAVAILABLE" } satisfies RepositoryError;
    }

    return map_prisma_to_lead(lead);
  } catch (error) {
    handle_repository_error(error);
  }
}

async function delete_lead(id: string, corretor_id: string): Promise<void> {
  try {
    await prisma.lead.deleteMany({
      where: { id, corretor_id },
    });
  } catch (error) {
    handle_repository_error(error);
  }
}

export const lead_repository: LeadRepository = {
  create,
  find_all,
  find_by_id,
  update,
  delete: delete_lead,
};
