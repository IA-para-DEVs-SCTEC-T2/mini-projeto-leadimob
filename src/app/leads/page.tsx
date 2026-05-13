import Link from "next/link";
import { list_leads } from "@/services/list_leads";
import { lead_repository } from "@/infra/repositories/lead_repository";
import type { Lead, LeadPriority } from "@/types/lead";
import LeadCard from "@/components/lead_card";
import PriorityBadge from "@/components/priority_badge";
import { format_currency, format_score } from "@/lib/formatters";

interface LeadStats {
  total: number;
  alto: number;
  medio: number;
  baixo: number;
  nao_classificado: number;
}

function calculate_stats(leads: Lead[]): LeadStats {
  return leads.reduce(
    (stats, lead) => {
      stats.total += 1;
      if (lead.priority === "Alto") stats.alto += 1;
      else if (lead.priority === "Medio") stats.medio += 1;
      else if (lead.priority === "Baixo") stats.baixo += 1;
      else if (lead.priority === "NaoClassificado") stats.nao_classificado += 1;
      return stats;
    },
    {
      total: 0,
      alto: 0,
      medio: 0,
      baixo: 0,
      nao_classificado: 0,
    },
  );
}

export default async function LeadsPage() {
  let leads: Lead[] = [];
  let error: string | null = null;

  try {
    leads = await list_leads(lead_repository);
  } catch (err) {
    console.error("Erro ao carregar leads:", err);
    error =
      "Erro ao carregar a lista de leads. Por favor, tente novamente mais tarde.";
  }

  const stats = calculate_stats(leads);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold text-yellow-400">LeadImobi</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/leads/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-yellow-500"
          >
            <span>+</span>
            <span>Novo Lead</span>
          </Link>

          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
            disabled
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-600 bg-red-900/20 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-200">Erro ao carregar</h3>
                <p className="mt-1 text-sm text-red-100">{error}</p>
              </div>
              <Link
                href="/leads"
                className="whitespace-nowrap rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Tentar novamente
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && leads.length === 0 && (
          <div className="rounded-lg border border-slate-600 bg-slate-800 p-12 text-center">
            <div className="mb-4 text-5xl">📭</div>
            <h2 className="mb-2 text-xl font-semibold text-slate-100">
              Nenhum lead cadastrado
            </h2>
            <p className="mb-6 text-slate-400">
              Comece cadastrando seu primeiro lead para ver a lista priorizada.
            </p>
            <Link
              href="/leads/novo"
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-6 py-2 font-semibold text-slate-900 transition-colors hover:bg-yellow-500"
            >
              <span>+</span>
              <span>Cadastrar primeiro lead</span>
            </Link>
          </div>
        )}

        {/* Stats Section */}
        {!error && leads.length > 0 && (
          <>
            <div className="mb-8 grid grid-cols-5 gap-4">
              <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
                <div className="text-sm text-slate-400">Total</div>
                <div className="mt-2 text-3xl font-bold text-slate-100">
                  {stats.total}
                </div>
              </div>

              <div className="rounded-lg border border-green-600 bg-green-900/20 p-4">
                <div className="text-sm text-green-300">Alto</div>
                <div className="mt-2 text-3xl font-bold text-green-400">
                  {stats.alto}
                </div>
              </div>

              <div className="rounded-lg border border-yellow-600 bg-yellow-900/20 p-4">
                <div className="text-sm text-yellow-300">Médio</div>
                <div className="mt-2 text-3xl font-bold text-yellow-400">
                  {stats.medio}
                </div>
              </div>

              <div className="rounded-lg border border-red-600 bg-red-900/20 p-4">
                <div className="text-sm text-red-300">Baixo</div>
                <div className="mt-2 text-3xl font-bold text-red-400">
                  {stats.baixo}
                </div>
              </div>

              <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
                <div className="text-sm text-slate-400">Não classificado</div>
                <div className="mt-2 text-3xl font-bold text-slate-100">
                  {stats.nao_classificado}
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="mb-4 rounded-t-lg border border-b-0 border-slate-600 bg-slate-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-100">
                Lista Priorizada de Leads
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-b-lg border border-slate-600 bg-slate-800">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">
                      Score
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                      Renda
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                      Valor Imóvel
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={`border-b border-slate-700 transition-colors hover:bg-slate-700/50 ${
                        index % 2 === 0 ? "bg-slate-800" : "bg-slate-800/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-slate-100">
                            {lead.nome}
                          </div>
                          <div className="text-xs text-slate-400">
                            {lead.email}
                          </div>
                          <div className="text-xs text-slate-500">
                            ({lead.telefone})
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-300">
                          {lead.email}
                        </div>
                        <div className="text-xs text-slate-500">
                          {lead.telefone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-bold text-yellow-400">
                          {lead.score !== null ? format_score(lead.score) : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PriorityBadge priority={lead.priority} />
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300">
                        {format_currency(lead.renda_mensal)}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300">
                        {format_currency(lead.valor_imovel)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="inline-flex rounded bg-yellow-400 px-3 py-1 text-sm font-medium text-slate-900 transition-colors hover:bg-yellow-500"
                        >
                          Ver Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
