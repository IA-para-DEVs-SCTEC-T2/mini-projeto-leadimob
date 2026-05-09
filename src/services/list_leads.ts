import type { Lead } from '@/types/lead';
import { rank_leads } from '@/services/rank_leads';

interface LeadRepository {
  find_all(): Promise<Lead[]>;
}

export async function list_leads(
  lead_repository: LeadRepository
): Promise<Lead[]> {
  const leads = await lead_repository.find_all();

  return rank_leads(leads);
}