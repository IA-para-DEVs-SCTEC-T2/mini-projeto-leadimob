import { normalize_email } from "@/domain/entities/lead";
import { calculate_lead_score } from "@/domain/rules/calculate_lead_score";
import type {
  Lead,
  LeadRepository,
  UpdateLeadData,
  UpdateLeadInput,
} from "@/types/lead";

export async function update_lead(
  repository: LeadRepository,
  id: string,
  corretor_id: string,
  input: UpdateLeadInput,
): Promise<Lead> {
  const score_result = calculate_lead_score(
    input.renda_mensal,
    input.valor_imovel,
  );

  const data: UpdateLeadData = {
    nome: input.nome,
    email: normalize_email(input.email),
    cpf: input.cpf,
    telefone: input.telefone,
    valor_imovel: input.valor_imovel,
    renda_mensal: input.renda_mensal,
    score: score_result.valid ? score_result.score : null,
    priority: score_result.priority,
  };

  return await repository.update(id, corretor_id, data);
}