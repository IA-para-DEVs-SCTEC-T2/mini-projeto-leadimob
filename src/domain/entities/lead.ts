import type { Lead, LeadPriority } from "@/types/lead";

export function normalize_email(email: string): string {
  return email.trim().toLowerCase();
}

export function round_score(score: number): number {
  return Math.round(score * 100) / 100;
}

export function get_priority_from_score(score: number | null): LeadPriority {
  if (score === null) {
    return "NaoClassificado";
  }

  if (score >= 80) {
    return "Alto";
  }

  if (score >= 40) {
    return "Medio";
  }

  if (score > 0) {
    return "Baixo";
  }

  return "NaoClassificado";
}

export function validate_lead_invariants(lead: Lead): boolean {
  const has_normalized_email = lead.email === normalize_email(lead.email);
  const has_rounded_score =
    lead.score === null || lead.score === round_score(lead.score);
  const has_consistent_priority =
    lead.priority === get_priority_from_score(lead.score);

  return has_normalized_email && has_rounded_score && has_consistent_priority;
}
