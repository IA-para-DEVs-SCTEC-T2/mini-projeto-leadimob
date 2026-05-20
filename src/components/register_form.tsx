'use client'

import { useState, useTransition } from 'react'
import { register_action } from '@/app/auth/actions'
import Link from 'next/link'

interface FormErrors {
  nome?: string[]
  email?: string[]
  senha?: string[]
  _form?: string[]
}

export function RegisterForm() {
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const form = new FormData()
    form.append('nome', formData.nome)
    form.append('email', formData.email)
    form.append('senha', formData.senha)

    startTransition(async () => {
      const result = await register_action(form)
      if (result && !result.success) {
        setErrors(result.errors || {})
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <span className="text-2xl font-bold text-white">L</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LeadImobi</h1>
          <p className="text-slate-400">Crie sua conta de corretor</p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Erro Geral */}
            {errors._form && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400 text-sm">{errors._form[0]}</p>
              </div>
            )}

            {/* Campo Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full px-4 py-3 bg-slate-900 border ${
                  errors.nome ? 'border-red-500' : 'border-slate-700'
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Digite seu nome completo"
              />
              {errors.nome && (
                <p className="mt-2 text-sm text-red-400">{errors.nome[0]}</p>
              )}
            </div>

            {/* Campo E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full px-4 py-3 bg-slate-900 border ${
                  errors.email ? 'border-red-500' : 'border-slate-700'
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email[0]}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full px-4 py-3 bg-slate-900 border ${
                  errors.senha ? 'border-red-500' : 'border-slate-700'
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Mínimo 8 caracteres"
              />
              {errors.senha && (
                <p className="mt-2 text-sm text-red-400">{errors.senha[0]}</p>
              )}
            </div>

            {/* Botão Cadastrar */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {isPending ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Já possui uma conta?{' '}
              <Link
                href="/auth/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
