import type { Lead } from "@/types/lead";

type ScoredLead = Lead & { score: number };

function has_score(lead: Lead): lead is ScoredLead {
  return lead.score !== null;
}

export function rank_leads(leads: Lead[]): Lead[] {
  const scored_leads = leads.filter(has_score);
  const unclassified_leads = leads.filter((lead) => !has_score(lead));

  const ranked_leads = [...scored_leads].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    return b.created_at.getTime() - a.created_at.getTime();
  });

  return [...ranked_leads, ...unclassified_leads];
}
