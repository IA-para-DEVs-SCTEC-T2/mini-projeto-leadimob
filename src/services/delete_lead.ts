import type { LeadRepository } from "@/types/lead";

export async function delete_lead(
  repository: LeadRepository,
  id: string,
): Promise<void> {
  await repository.delete(id);
}