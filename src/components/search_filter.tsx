"use client";

import { useCallback, useEffect, useState } from "react";

export default function SearchFilter() {
  const [search_term, set_search_term] = useState("");

  const show_empty_search_state = useCallback((should_show: boolean) => {
    let empty_state = document.getElementById("search-empty-state");

    if (should_show && !empty_state) {
      // Create empty state element for cards
      const cards_container = document.getElementById("leads-cards-container");
      if (cards_container) {
        empty_state = document.createElement("div");
        empty_state.id = "search-empty-state";
        empty_state.className = "py-8 text-center text-slate-400";

        // ✅ SEGURO - Construir elementos via API DOM sem interpolação de strings
        const icon_div = document.createElement("div");
        icon_div.className = "text-4xl mb-2";
        icon_div.textContent = "🔍";

        const message_p = document.createElement("p");
        message_p.className = "text-sm";
        message_p.textContent = `Nenhum lead encontrado para "${search_term}"`;

        const hint_p = document.createElement("p");
        hint_p.className = "text-xs mt-1";
        hint_p.textContent = "Tente buscar por nome, email ou telefone";

        empty_state.appendChild(icon_div);
        empty_state.appendChild(message_p);
        empty_state.appendChild(hint_p);
        cards_container.appendChild(empty_state);
      }

      // Create empty state for table
      const table_body = document.getElementById("leads-table-body");
      if (table_body) {
        const empty_row = document.createElement("tr");
        empty_row.id = "search-empty-state-row";
        const empty_cell = document.createElement("td");
        (empty_cell as HTMLTableCellElement).colSpan = 7;
        empty_cell.className = "py-8 text-center text-slate-400";

        // ✅ SEGURO - Construir elementos via API DOM sem interpolação de strings
        const icon_div = document.createElement("div");
        icon_div.className = "text-4xl mb-2";
        icon_div.textContent = "🔍";

        const message_p = document.createElement("p");
        message_p.className = "text-sm";
        message_p.textContent = `Nenhum lead encontrado para "${search_term}"`;

        const hint_p = document.createElement("p");
        hint_p.className = "text-xs mt-1";
        hint_p.textContent = "Tente buscar por nome, email ou telefone";

        empty_cell.appendChild(icon_div);
        empty_cell.appendChild(message_p);
        empty_cell.appendChild(hint_p);
        empty_row.appendChild(empty_cell);
        table_body.appendChild(empty_row);
      }
    } else if (!should_show) {
      // Remove empty states
      document.querySelectorAll("#search-empty-state").forEach(el => el.remove());
      document.querySelectorAll("#search-empty-state-row").forEach(el => el.remove());
    }
  }, [search_term]);

  useEffect(() => {
    const filter_leads = () => {
      const search_lower = search_term.toLowerCase().trim();

      // Filter table rows (desktop)
      const table_rows = document.querySelectorAll(".lead-row");
      table_rows.forEach((row) => {
        const search_text = row.getAttribute("data-search-text") || "";
        const should_show = search_lower === "" || search_text.includes(search_lower);
        (row as HTMLElement).style.display = should_show ? "" : "none";
      });

      // Filter cards (mobile)
      const cards = document.querySelectorAll(".lead-card");
      cards.forEach((card) => {
        const search_text = card.getAttribute("data-search-text") || "";
        const should_show = search_lower === "" || search_text.includes(search_lower);
        (card as HTMLElement).style.display = should_show ? "" : "none";
      });

      // Show/hide empty state if no results
      const visible_rows = Array.from(table_rows).filter(row =>
        (row as HTMLElement).style.display !== "none",
      );
      const visible_cards = Array.from(cards).filter(card =>
        (card as HTMLElement).style.display !== "none",
      );

      // Add empty state for search results
      show_empty_search_state(search_lower !== "" && visible_rows.length === 0 && visible_cards.length === 0);
    };

    // Debounce the search to avoid too many DOM updates
    const timeout = setTimeout(filter_leads, 150);
    return () => clearTimeout(timeout);
  }, [search_term, show_empty_search_state]);

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