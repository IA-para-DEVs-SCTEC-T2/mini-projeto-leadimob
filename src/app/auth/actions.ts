'use server'

import { redirect } from 'next/navigation'
import { RegisterSchema } from '@/schemas/corretor.schema'
import { create_corretor } from '@/services/create_corretor'
import { corretor_repository } from '@/infra/repositories/corretor_repository'

interface RegisterActionResult {
  success: boolean
  errors?: {
    nome?: string[]
    email?: string[]
    senha?: string[]
    _form?: string[]
  }
}

export async function register_action(
  formData: FormData
): Promise<RegisterActionResult | never> {
  // Extrair dados do FormData
  const data = {
    nome: formData.get('nome') as string,
    email: formData.get('email') as string,
    senha: formData.get('senha') as string,
  }

  // Validar com Zod
  const result = RegisterSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Tentar criar o corretor
  try {
    await create_corretor(corretor_repository, result.data)
  } catch (error: any) {
    // Erro de email duplicado
    if (error?.error === 'EMAIL_ALREADY_EXISTS') {
      return {
        success: false,
        errors: {
          _form: ['Não foi possível criar a conta. Verifique os dados e tente novamente.'],
        },
      }
    }

    // Erro genérico
    console.error('Error in register_action:', error)
    return {
      success: false,
      errors: {
        _form: ['Erro interno. Tente novamente.'],
      },
    }
  }

  // Sucesso - redirecionar para login
  redirect('/auth/login')
}
