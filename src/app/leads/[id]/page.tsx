import Link from "next/link";
import { lead_repository } from "@/infra/repositories/lead_repository";
import LeadCard from "@/components/lead_card";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps) {
  const { id } = await params;

  let lead = null;
  let error: string | null = null;

  try {
    lead = await lead_repository.find_by_id(id);
  } catch (err) {
    console.error("Erro ao carregar lead:", err);
    error = "Erro ao carregar os detalhes do lead.";
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <h1 className="text-2xl font-bold text-yellow-400">LeadImobi</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Corretor Premium</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-2xl px-6 py-8">
          <div className="mb-6">
            <Link
              href="/leads"
              className="text-sm text-yellow-400 transition-colors hover:text-yellow-300"
            >
              ← Voltar para lista
            </Link>
          </div>

          <div className="rounded-lg border border-red-600 bg-red-900/20 p-6">
            <h2 className="mb-2 text-lg font-semibold text-red-200">
              Lead não encontrado
            </h2>
            <p className="text-sm text-red-100">
              {error || "O lead que você está procurando não existe."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold text-yellow-400">LeadImobi</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Corretor Premium</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6">
          <Link
            href="/leads"
            className="text-sm text-yellow-400 transition-colors hover:text-yellow-300"
          >
            ← Voltar para lista
          </Link>
        </div>

        <LeadCard lead={lead} />
      </main>
    </div>
  );
}
