import type { Lead, LeadRepository } from "@/types/lead";
import { rank_leads, type SortOption } from "@/services/rank_leads";

export async function list_leads(
  lead_repository: LeadRepository,
  sort_by: SortOption = "score",
): Promise<Lead[]> {
  const leads = await lead_repository.find_all();

  return rank_leads(leads, sort_by);
}
