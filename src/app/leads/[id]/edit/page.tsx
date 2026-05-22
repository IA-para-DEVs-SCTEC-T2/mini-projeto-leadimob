import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import LeadForm from "@/components/lead_form";
import { lead_repository } from "@/infra/repositories/lead_repository";
import { auth } from "@/lib/auth";

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center">
          <Link
            href={`/leads/${id}`}
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
            <h1 className="text-xl font-bold text-slate-100">
              Editar Lead
            </h1>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">{lead.nome}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
          <LeadForm mode="edit" lead={lead} />
        </div>
      </main>
    </div>
  );
}