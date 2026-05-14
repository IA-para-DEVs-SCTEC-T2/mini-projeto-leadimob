"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/services/rank_leads";

interface SortSelectorProps {
  current_sort: SortOption;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "score", label: "Score (Maior)" },
  { value: "priority", label: "Prioridade" },
  { value: "renda", label: "Renda (Maior)" },
  { value: "valor_imovel", label: "Valor Imóvel (Maior)" },
];

export default function SortSelector({
  current_sort,
}: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handle_sort_change = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="text-sm font-medium text-slate-300">
        Ordenar por:
      </span>
      <select
        value={current_sort}
        onChange={(e) => handle_sort_change(e.target.value as SortOption)}
        className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 transition-colors hover:border-slate-500 focus:border-yellow-400 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
