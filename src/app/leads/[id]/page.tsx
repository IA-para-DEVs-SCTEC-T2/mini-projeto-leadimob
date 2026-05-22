import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { lead_repository } from "@/infra/repositories/lead_repository";
import PriorityBadge from "@/components/priority_badge";
import LeadActions from "@/components/lead_actions";
import {
  format_currency,
  format_date,
  format_score,
  mask_cpf_display,
} from "@/lib/formatters";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps) {
  // Verificar autenticação
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const lead = await lead_repository.find_by_id(id, session.user.id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <Link
            href="/leads"
            className="flex items-center gap-2 text-yellow-400 transition-colors hover:text-yellow-300"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold text-yellow-400">LeadImobi</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Lead Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{lead.nome}</h2>
            <p className="text-slate-400">
              Cadastrado em {format_date(lead.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-4xl font-bold text-yellow-400">
                {format_score(lead.score)}
              </div>
              <div className="text-sm text-slate-400">Score</div>
            </div>
            <PriorityBadge priority={lead.priority} />
            <LeadActions leadId={lead.id} leadName={lead.nome} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados Pessoais */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-600/50">
            <h3 className="text-lg font-semibold text-yellow-400 mb-6 uppercase tracking-wide">
              Dados Pessoais
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Nome Completo
                </label>
                <div className="text-white font-medium">{lead.nome}</div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  E-mail
                </label>
                <div className="flex items-center gap-2 text-white">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {lead.email}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Telefone
                </label>
                <div className="text-white font-medium">{lead.telefone}</div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  CPF
                </label>
                <div className="text-white font-medium">{mask_cpf_display(lead.cpf)}</div>
              </div>
            </div>
          </div>

          {/* Dados Financeiros */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-600/50">
            <h3 className="text-lg font-semibold text-yellow-400 mb-6 uppercase tracking-wide">
              Dados Financeiros
            </h3>

            <div className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  <span className="text-sm text-slate-400">Renda Mensal</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {format_currency(lead.renda_mensal)}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm text-slate-400">Valor do Imóvel</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {format_currency(lead.valor_imovel)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
