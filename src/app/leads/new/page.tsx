import Link from "next/link";
import LeadForm from "@/components/lead_form";

export default function NewLeadPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <Link
            href="/leads"
            className="mr-4 text-slate-400 transition-colors hover:text-slate-300"
          >
            ←
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold text-yellow-400">LeadImobi</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-slate-600 bg-slate-800 p-8">
              <h1 className="mb-2 text-2xl font-bold text-slate-100">
                Cadastro de Novo Lead
              </h1>
              <p className="mb-8 text-slate-400">
                Preencha os dados do lead para calcular o índice de qualificação
              </p>

              <LeadForm />
            </div>
          </div>

          {/* Qualification Result Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-slate-600 bg-slate-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-100">
                RESULTADO DA QUALIFICAÇÃO
              </h2>

              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-600">
                  <span className="text-3xl text-slate-500">📊</span>
                </div>
              </div>

              <p className="mb-8 text-center text-sm text-slate-400">
                Preencha os dados e clique em "Calcular Índice" para ver o
                resultado da qualificação
              </p>

              <div className="rounded-lg border border-slate-600 bg-slate-700 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-100">
                  FÓRMULA DE QUALIFICAÇÃO
                </h3>
                <div className="rounded bg-slate-800 p-3 font-mono text-sm">
                  <span className="text-yellow-400">Índice</span>
                  <span className="text-slate-300"> = </span>
                  <span className="text-slate-300">(</span>
                  <span className="text-blue-400">Renda</span>
                  <span className="text-slate-300"> × </span>
                  <span className="text-yellow-400">12</span>
                  <span className="text-slate-300"> × </span>
                  <span className="text-yellow-400">5</span>
                  <span className="text-slate-300">) ÷ </span>
                  <span className="text-green-400">Valor Imóvel</span>
                  <span className="text-slate-300"> × </span>
                  <span className="text-yellow-400">100</span>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  O índice considera comprometimento de compra, renda e valor do
                  imóvel para priorização automática.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}