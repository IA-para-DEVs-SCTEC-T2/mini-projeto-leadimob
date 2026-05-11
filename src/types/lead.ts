export type LeadPriority = "Alto" | "Medio" | "Baixo" | "NaoClassificado";

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  valor_imovel: number;
  renda_mensal: number;
  score: number | null;
  priority: LeadPriority;
  created_at: Date;
}

export interface CreateLeadInput {
  nome: string;
  email: string;
  telefone: string;
  valor_imovel: number;
  renda_mensal: number;
}

export type LeadScoreResult =
  | {
      valid: true;
      score: number;
      priority: LeadPriority;
    }
  | {
      valid: false;
      priority: "NaoClassificado";
    };
