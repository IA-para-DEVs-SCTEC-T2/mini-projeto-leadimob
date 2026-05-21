export interface Corretor {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  created_at: Date;
}

export interface CorretorWithHash extends Corretor {
  password_hash: string;
}

export interface CreateCorretorInput {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
}
