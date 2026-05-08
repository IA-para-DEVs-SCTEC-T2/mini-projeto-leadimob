import type { Lead } from '@/types/lead';

type ScoredLead = Lead & { score: number };

export function rank_leads(leads: Lead[]): Lead[] {
  const valid_leads = leads.filter((lead): lead is ScoredLead => lead.score !== null);
  const unclassified_leads = leads.filter((lead) => lead.score === null);

  const ranked_leads = [...valid_leads].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    return a.created_at.getTime() - b.created_at.getTime();
  });

  return [...ranked_leads, ...unclassified_leads];
}
