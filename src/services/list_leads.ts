import { rank_leads, type SortOption } from "@/services/rank_leads";
import type { Lead, LeadRepository } from "@/types/lead";

export async function list_leads(
  lead_repository: LeadRepository,
  corretor_id: string,
  sort_by: SortOption = "score",
): Promise<Lead[]> {
  const leads = await lead_repository.find_all(corretor_id);

  return rank_leads(leads, sort_by);
}
