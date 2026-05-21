"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface SearchFilterInputProps {
  current_query: string;
  on_replace: (url: string) => void;
  search_params: string;
}

function SearchFilterInput({
  current_query,
  on_replace,
  search_params,
}: SearchFilterInputProps) {
  const [search_term, set_search_term] = useState(current_query);

  useEffect(() => {
    const trimmed_search = search_term.trim();

    if (trimmed_search === current_query) {
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(search_params);

      if (trimmed_search) {
        params.set("q", trimmed_search);
      } else {
        params.delete("q");
      }

      const query_string = params.toString();
      on_replace(query_string ? `/leads?${query_string}` : "/leads");
    }, 150);

    return () => clearTimeout(timeout);
  }, [current_query, on_replace, search_params, search_term]);

  const clear_search = () => {
    set_search_term("");
  };

  return (
    <div className="relative w-full sm:flex-1">
      <input
        type="text"
        placeholder="Buscar por nome, email ou telefone..."
        value={search_term}
        onChange={(e) => set_search_term(e.target.value)}
        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 pr-10 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
      />

      {search_term && (
        <button
          onClick={clear_search}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          title="Limpar busca"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {!search_term && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current_query = useMemo(
    () => searchParams.get("q") ?? "",
    [searchParams],
  );
  const replace_url = useCallback((url: string) => {
    router.replace(url);
  }, [router]);

  return (
    <SearchFilterInput
      key={current_query}
      current_query={current_query}
      on_replace={replace_url}
      search_params={searchParams.toString()}
    />
  );
}
