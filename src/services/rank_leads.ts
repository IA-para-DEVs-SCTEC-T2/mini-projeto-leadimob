import type { Lead } from "@/types/lead";

type ScoredLead = Lead & { score: number };

export type SortOption = "score" | "priority" | "renda" | "valor_imovel";

function has_score(lead: Lead): lead is ScoredLead {
  return lead.score !== null;
}

function get_priority_order(priority: string): number {
  switch (priority) {
  case "Alto":
    return 3;
  case "Medio":
    return 2;
  case "Baixo":
    return 1;
  case "NaoClassificado":
    return 0;
  default:
    return 0;
  }
}

export function rank_leads(leads: Lead[], sort_by: SortOption = "score"): Lead[] {
  const scored_leads = leads.filter(has_score);
  const unclassified_leads = leads.filter((lead) => !has_score(lead));

  let ranked_leads: Lead[];

  if (sort_by === "score") {
    ranked_leads = [...scored_leads].sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return b.created_at.getTime() - a.created_at.getTime();
    });
  } else if (sort_by === "priority") {
    ranked_leads = [...leads].sort((a, b) => {
      const priority_diff = get_priority_order(b.priority) - get_priority_order(a.priority);
      if (priority_diff !== 0) {
        return priority_diff;
      }
      return b.created_at.getTime() - a.created_at.getTime();
    });
  } else if (sort_by === "renda") {
    ranked_leads = [...leads].sort((a, b) => {
      if (a.renda_mensal !== b.renda_mensal) {
        return b.renda_mensal - a.renda_mensal;
      }
      return b.created_at.getTime() - a.created_at.getTime();
    });
  } else if (sort_by === "valor_imovel") {
    ranked_leads = [...leads].sort((a, b) => {
      if (a.valor_imovel !== b.valor_imovel) {
        return b.valor_imovel - a.valor_imovel;
      }
      return b.created_at.getTime() - a.created_at.getTime();
    });
  } else {
    ranked_leads = [...scored_leads].sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return b.created_at.getTime() - a.created_at.getTime();
    });
  }

  return sort_by === "score" ? [...ranked_leads, ...unclassified_leads] : ranked_leads;
}
