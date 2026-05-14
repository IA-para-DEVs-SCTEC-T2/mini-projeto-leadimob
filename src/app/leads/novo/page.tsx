import Link from "next/link";
import LeadForm from "@/components/lead_form";

export default function NovoLeadPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold text-yellow-400">LeadImobi</h1>
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

        <div className="rounded-lg border border-slate-600/50 bg-slate-800/60 backdrop-blur-sm p-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-100">
            Cadastrar novo lead
          </h1>
          <p className="mb-6 text-slate-400">
            Preencha os dados do cliente para qualificação automática.
          </p>

          <LeadForm />
        </div>
      </main>
    </div>
  );
}
