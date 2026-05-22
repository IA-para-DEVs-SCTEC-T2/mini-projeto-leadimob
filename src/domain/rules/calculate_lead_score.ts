import type { LeadPriority, LeadScoreResult } from "@/types/lead";

function get_priority_from_score(score: number): LeadPriority {
  if (score >= 80) {
    return "Alto";
  }

  if (score >= 40) {
    return "Medio";
  }

  return "Baixo";
}

export function calculate_lead_score(
  renda_mensal: number | null,
  valor_imovel: number | null,
): LeadScoreResult {
  if (valor_imovel === null || !(valor_imovel > 0)) {
    return {
      valid: false,
      priority: "NaoClassificado",
    };
  }

  if (renda_mensal === null || !(renda_mensal > 0)) {
    return {
      valid: false,
      priority: "NaoClassificado",
    };
  }

  const score =
    Math.round(((renda_mensal * 12 * 5) / valor_imovel) * 100 * 100) / 100;

  return {
    valid: true,
    score,
    priority: get_priority_from_score(score),
  };
}
