import type { CSSProperties } from "react";

import {
  format_cpf,
  format_currency,
  format_date,
  format_score,
} from "@/lib/formatters";
import type { Lead } from "@/types/lead";

interface LeadCardProps {
  lead: Lead;
}

const card_style: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
};

const title_style: CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  margin: "0 0 8px",
};

const list_style: CSSProperties = {
  display: "grid",
  gap: "6px",
  margin: 0,
};

const row_style: CSSProperties = {
  display: "grid",
  gap: "2px",
};

const label_style: CSSProperties = {
  color: "#6b7280",
  fontSize: "12px",
};

const value_style: CSSProperties = {
  color: "#111827",
};

export default function LeadCard({ lead }: LeadCardProps) {
  return (
    <article style={card_style}>
      <h2 style={title_style}>{lead.nome}</h2>

      <dl style={list_style}>
        <div style={row_style}>
          <dt style={label_style}>Email</dt>
          <dd style={value_style}>{lead.email}</dd>
        </div>

        <div style={row_style}>
          <dt style={label_style}>CPF</dt>
          <dd style={value_style}>{format_cpf(lead.cpf)}</dd>
        </div>

        <div style={row_style}>
          <dt style={label_style}>Telefone</dt>
          <dd style={value_style}>{lead.telefone}</dd>
        </div>

        <div style={row_style}>
          <dt style={label_style}>Prioridade</dt>
          <dd style={value_style}>{lead.priority}</dd>
        </div>

        <div style={row_style}>
          <dt style={label_style}>Score</dt>
          <dd style={value_style}>{format_score(lead.score)}</dd>
        </div>

        <div style={row_style}>
          <dt style={label_style}>Valor do imovel</dt>
          <dd style={value_style}>{format_currency(lead.valor_imovel)}</dd>
        </div>

        <div style={row_style}>
          <dt style={label_style}>Criado em</dt>
          <dd style={value_style}>{format_date(lead.created_at)}</dd>
        </div>
      </dl>
    </article>
  );
}
