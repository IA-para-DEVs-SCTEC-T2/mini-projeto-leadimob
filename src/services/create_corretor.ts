import bcrypt from 'bcryptjs'
import type { Corretor, CreateCorretorInput } from '@/types/corretor'
import type { corretor_repository } from '@/infra/repositories/corretor_repository'

async function create_corretor(
  repository: Pick<typeof corretor_repository, 'create'>,
  input: CreateCorretorInput
): Promise<Corretor> {
  const password_hash = await bcrypt.hash(input.senha, 10)
  return repository.create({ nome: input.nome, email: input.email, password_hash })
}

export { create_corretor }
