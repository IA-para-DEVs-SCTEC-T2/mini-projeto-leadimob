export type LeadPriority = "Alto" | "Medio" | "Baixo" | "NaoClassificado";

export interface Lead {
  id: string;
  nome: string;
  email: string;
  cpf: string;
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
  cpf: string;
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

export interface CreateLeadData {
  corretor_id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  valor_imovel: number;
  renda_mensal: number;
  score: number | null;
  priority: LeadPriority;
}

export interface UpdateLeadData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  valor_imovel: number;
  renda_mensal: number;
  score: number | null;
  priority: LeadPriority;
}

export interface UpdateLeadInput {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  valor_imovel: number;
  renda_mensal: number;
}

export interface LeadRepository {
  create(data: CreateLeadData): Promise<Lead>;
  find_all(corretor_id: string): Promise<Lead[]>;
  find_by_id(id: string, corretor_id: string): Promise<Lead | null>;
  update(id: string, corretor_id: string, data: UpdateLeadData): Promise<Lead>;
  delete(id: string, corretor_id: string): Promise<void>;
}