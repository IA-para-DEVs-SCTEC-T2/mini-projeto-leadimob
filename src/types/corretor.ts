export interface Corretor {
  id: string;
  nome: string;
  email: string;
  created_at: Date;
}

export interface CorretorWithHash extends Corretor {
  password_hash: string;
}

export interface CreateCorretorInput {
  nome: string;
  email: string;
  senha: string;
}
