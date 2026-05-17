"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { delete_lead_action } from "@/app/leads/actions";

interface LeadActionsProps {
  leadId: string;
  leadName: string;
}

export default function LeadActions({ leadId, leadName }: LeadActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleDeleteClick() {
    setShowDeleteModal(true);
    setDeleteError(null);
  }

  function handleDeleteCancel() {
    setShowDeleteModal(false);
    setDeleteError(null);
  }

  function handleDeleteConfirm() {
    startTransition(async () => {
      const result = await delete_lead_action(leadId);

      if (result.success) {
        // Redirect is handled by the Server Action
        return;
      }

      if ("error" in result) {
        setDeleteError(result.error);
      }
    });
  }

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/leads/${leadId}/edit`}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Editar
        </Link>

        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          disabled={isPending}
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">
                Confirmar Exclusão
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Tem certeza que deseja excluir o lead{" "}
                <span className="font-medium text-yellow-400">{leadName}</span>?
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            {deleteError && (
              <div className="mb-4 rounded bg-red-600/20 border border-red-600/30 px-3 py-2 text-sm text-red-300">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 rounded border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-600"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}