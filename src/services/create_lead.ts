import { normalize_email } from "@/domain/entities/lead";
import { calculate_lead_score } from "@/domain/rules/calculate_lead_score";
import type {
  CreateLeadData,
  CreateLeadInput,
  Lead,
  LeadRepository,
} from "@/types/lead";

export async function create_lead(
  repository: LeadRepository,
  input: CreateLeadInput,
): Promise<Lead> {
  const score_result = calculate_lead_score(
    input.renda_mensal,
    input.valor_imovel,
  );

  const data: CreateLeadData = {
    nome: input.nome,
    email: normalize_email(input.email),
    cpf: input.cpf,
    telefone: input.telefone,
    valor_imovel: input.valor_imovel,
    renda_mensal: input.renda_mensal,
    score: score_result.valid ? score_result.score : null,
    priority: score_result.valid ? score_result.priority : "NaoClassificado",
  };

  return repository.create(data);
}
