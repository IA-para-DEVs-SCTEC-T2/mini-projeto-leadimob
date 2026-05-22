"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { register_action } from "@/app/auth/actions";

interface FormErrors {
  nome?: string[]
  email?: string[]
  telefone?: string[]
  senha?: string[]
  confirmar_senha?: string[]
  _form?: string[]
}

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmar_senha: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Validação client-side de confirmação de senha
    if (formData.senha !== formData.confirmar_senha) {
      setErrors({ confirmar_senha: ["As senhas não coincidem."] });
      return;
    }

    if (!acceptedTerms) {
      setErrors({ _form: ["Você precisa aceitar os termos de uso e política de privacidade."] });
      return;
    }

    const form = new FormData();
    form.append("nome", formData.nome);
    form.append("email", formData.email);
    form.append("telefone", formData.telefone);
    form.append("senha", formData.senha);

    startTransition(async () => {
      const result = await register_action(form);
      if (result && !result.success) {
        setErrors(result.errors ?? {});
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let masked = digits;
    if (digits.length > 10) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 6) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length > 0) {
      masked = `(${digits}`;
    }
    setFormData((prev) => ({ ...prev, telefone: masked }));
  };

  const inputBase =
    "w-full px-3 py-2.5 bg-slate-700/50 border rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all disabled:opacity-50";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 py-8">
      {/* Logo com seta de voltar */}
      <div className="w-full max-w-lg mb-6 flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-slate-400 hover:text-slate-300 transition-colors"
          aria-label="Voltar para login"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xl">🏠</span>
          <span className="text-yellow-400 text-xl font-bold">LeadImob</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white mb-1">Criar Conta</h1>
          <p className="text-slate-400 text-sm">Preencha os dados para criar sua conta no LeadImob</p>
        </div>

        {/* Erro Geral */}
        {errors._form && (
          <div className="mb-4 bg-red-500/10 border border-red-500/40 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors._form[0]}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seção: Dados Pessoais */}
          <div>
            <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-3">
              Dados Pessoais
            </h2>

            {/* Nome + Email em grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-1">
                  Nome Completo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                  className={`${inputBase} ${errors.nome ? "border-red-500" : "border-slate-600"}`}
                  placeholder="Ex: João da Silva"
                />
                {errors.nome && (
                  <p className="mt-1 text-xs text-red-400">{errors.nome[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  E-mail <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isPending}
                  required
                  className={`${inputBase} ${errors.email ? "border-red-500" : "border-slate-600"}`}
                  placeholder="Ex: joao.silva@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email[0]}</p>
                )}
              </div>
            </div>

            {/* Telefone — largura total */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-1">
                Telefone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                disabled={isPending}
                className={`${inputBase} ${errors.telefone ? "border-red-500" : "border-slate-600"}`}
                placeholder="(11) 98765-4321"
              />
              {errors.telefone && (
                <p className="mt-1 text-xs text-red-400">{errors.telefone[0]}</p>
              )}
            </div>
          </div>

          {/* Seção: Senha de Acesso */}
          <div>
            <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-3">
              Senha de Acesso
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-1">
                  Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    disabled={isPending}
                    required
                    className={`${inputBase} pr-10 ${errors.senha ? "border-red-500" : "border-slate-600"}`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.senha && (
                  <p className="mt-1 text-xs text-red-400">{errors.senha[0]}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmar_senha" className="block text-sm font-medium text-slate-300 mb-1">
                  Confirmar Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmar_senha"
                    name="confirmar_senha"
                    value={formData.confirmar_senha}
                    onChange={handleChange}
                    disabled={isPending}
                    required
                    className={`${inputBase} pr-10 ${errors.confirmar_senha ? "border-red-500" : "border-slate-600"}`}
                    placeholder="Digite a senha novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmar_senha && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmar_senha[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Checkbox Termos */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-slate-600 bg-slate-700 text-yellow-400 focus:ring-yellow-400/50 shrink-0"
            />
            <span className="text-slate-400 text-sm leading-snug">
              Concordo com os{" "}
              <button type="button" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                termos de uso
              </button>
              {" "}e{" "}
              <button type="button" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                política de privacidade
              </button>
            </span>
          </label>

          {/* Botões */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href="/auth/login"
              className="flex items-center justify-center px-4 py-2.5 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-800 text-sm"
            >
              {isPending ? "Criando..." : "Criar Conta"}
            </button>
          </div>
        </form>

        {/* Link para Login */}
        <div className="mt-5 text-center">
          <p className="text-slate-400 text-sm">
            Já tem uma conta?{" "}
            <Link
              href="/auth/login"
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
