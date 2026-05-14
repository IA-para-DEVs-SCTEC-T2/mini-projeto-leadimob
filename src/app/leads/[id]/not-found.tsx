import Link from "next/link";

export default function LeadNotFound() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4">
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
      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Lead não encontrado
            </h2>
            <p className="text-slate-400">
              O lead que você está procurando não existe ou foi removido.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/leads"
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
            >
              <svg
                className="h-4 w-4"
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
              Voltar para lista de leads
            </Link>

            <div className="text-sm text-slate-500">
              ou{" "}
              <Link
                href="/leads/new"
                className="text-yellow-400 hover:text-yellow-300"
              >
                cadastre um novo lead
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}