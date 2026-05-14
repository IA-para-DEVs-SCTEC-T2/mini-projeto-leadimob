import Link from "next/link";
import { list_leads } from "@/services/list_leads";
import { lead_repository } from "@/infra/repositories/lead_repository";
import type { Lead, LeadPriority } from "@/types/lead";
import type { SortOption } from "@/services/rank_leads";
import LeadCard from "@/components/lead_card";
import PriorityBadge from "@/components/priority_badge";
import SortSelector from "@/components/sort_selector";
import SearchFilter from "@/components/search_filter";
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

interface LeadsPageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const sort_by = (params.sort as SortOption) || "score";

  let leads: Lead[] = [];
  let error: string | null = null;

  try {
    leads = await list_leads(lead_repository, sort_by);
  } catch (err) {
    console.error("Erro ao carregar leads:", err);
    error =
      "Erro ao carregar a lista de leads. Por favor, tente novamente mais tarde.";
  }

  const stats = calculate_stats(leads);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🏠</span>
            <h1 className="text-xl font-bold text-yellow-400 sm:text-2xl">LeadImobi</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Top Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/leads/novo"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-yellow-500 sm:justify-start"
          >
            <span>+</span>
            <span>Novo Lead</span>
          </Link>

          <SearchFilter />
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
            <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              <div className="rounded-lg border border-slate-600 bg-slate-800 p-3 sm:p-4">
                <div className="text-xs text-slate-400 sm:text-sm">Total</div>
                <div className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
                  {stats.total}
                </div>
              </div>

              <div className="rounded-lg border border-green-600 bg-green-900/20 p-3 sm:p-4">
                <div className="text-xs text-green-300 sm:text-sm">Alto</div>
                <div className="mt-2 text-2xl font-bold text-green-400 sm:text-3xl">
                  {stats.alto}
                </div>
              </div>

              <div className="rounded-lg border border-yellow-600 bg-yellow-900/20 p-3 sm:p-4">
                <div className="text-xs text-yellow-300 sm:text-sm">Médio</div>
                <div className="mt-2 text-2xl font-bold text-yellow-400 sm:text-3xl">
                  {stats.medio}
                </div>
              </div>

              <div className="rounded-lg border border-red-600 bg-red-900/20 p-3 sm:p-4">
                <div className="text-xs text-red-300 sm:text-sm">Baixo</div>
                <div className="mt-2 text-2xl font-bold text-red-400 sm:text-3xl">
                  {stats.baixo}
                </div>
              </div>

              <div className="rounded-lg border border-slate-600 bg-slate-800 p-3 sm:p-4 sm:col-span-3 lg:col-span-1">
                <div className="text-xs text-slate-400 sm:text-sm">Não classificado</div>
                <div className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
                  {stats.nao_classificado}
                </div>
              </div>
            </div>

            {/* Table Header with Sort */}
            <div className="mb-4 rounded-t-lg border border-b-0 border-slate-600 bg-slate-800">
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-base font-semibold text-slate-100 sm:text-lg">
                  Lista Priorizada de Leads
                </h2>
                <SortSelector current_sort={sort_by} />
              </div>
            </div>

            {/* Table - Desktop View */}
            <div className="hidden overflow-x-auto rounded-b-lg border border-slate-600 bg-slate-800 lg:block">
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
                <tbody id="leads-table-body">
                  {leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={`lead-row border-b border-slate-700 transition-colors hover:bg-slate-700/50 ${
                        index % 2 === 0 ? "bg-slate-800" : "bg-slate-800/50"
                      }`}
                      data-search-text={`${lead.nome} ${lead.email} ${lead.telefone}`.toLowerCase()}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-100">
                          {lead.nome}
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

            {/* Card View - Mobile */}
            <div className="space-y-3 rounded-b-lg border border-t-0 border-slate-600 bg-slate-800 p-4 lg:hidden" id="leads-cards-container">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="lead-card rounded-lg border border-slate-700 bg-slate-700/50 p-4"
                  data-search-text={`${lead.nome} ${lead.email} ${lead.telefone}`.toLowerCase()}
                >
                  {/* Lead Name and Priority */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-100">
                        {lead.nome}
                      </h3>
                      <p className="text-xs text-slate-400">{lead.email}</p>
                      <p className="text-xs text-slate-500">{lead.telefone}</p>
                    </div>
                    <PriorityBadge priority={lead.priority} />
                  </div>

                  {/* Score and Financial Info */}
                  <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-slate-400">Score</span>
                      <p className="font-bold text-yellow-400">
                        {lead.score !== null ? format_score(lead.score) : "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Renda</span>
                      <p className="font-medium text-slate-300">
                        {format_currency(lead.renda_mensal)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Valor Imóvel</span>
                      <p className="font-medium text-slate-300">
                        {format_currency(lead.valor_imovel)}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/leads/${lead.id}`}
                    className="block w-full rounded bg-yellow-400 px-3 py-2 text-center text-sm font-medium text-slate-900 transition-colors hover:bg-yellow-500"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
