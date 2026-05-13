"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties, ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";
import {
  CreateLeadSchema,
  type CreateLeadInput,
} from "@/schemas/lead.schema";

type LeadFormField =
  | "nome"
  | "email"
  | "telefone"
  | "valor_imovel"
  | "renda_mensal";

type LeadFormValues = Record<LeadFormField, string>;
type LeadFormErrors = Partial<Record<LeadFormField, string>>;

interface LeadFormProps {
  initial_values?: Partial<LeadFormValues>;
  onSubmit?: (data: CreateLeadInput) => Promise<void> | void;
}

interface ValidationResult {
  data: CreateLeadInput | null;
  errors: LeadFormErrors;
}

const empty_values: LeadFormValues = {
  nome: "",
  email: "",
  telefone: "",
  valor_imovel: "",
  renda_mensal: "",
};

const form_style: CSSProperties = {
  display: "grid",
  gap: "16px",
  maxWidth: "520px",
};

const field_style: CSSProperties = {
  display: "grid",
  gap: "6px",
};

const label_style: CSSProperties = {
  color: "#111827",
  fontWeight: 600,
};

const input_style: CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  font: "inherit",
  padding: "10px 12px",
};

const error_style: CSSProperties = {
  color: "#b91c1c",
  fontSize: "14px",
  margin: 0,
};

const actions_style: CSSProperties = {
  display: "flex",
  gap: "12px",
};

const button_style: CSSProperties = {
  border: "1px solid #111827",
  borderRadius: "6px",
  cursor: "pointer",
  font: "inherit",
  padding: "10px 14px",
};

const submit_button_style: CSSProperties = {
  ...button_style,
  background: "#111827",
  color: "#ffffff",
};

const cancel_button_style: CSSProperties = {
  ...button_style,
  background: "#ffffff",
  color: "#111827",
};

function validate_form(values: LeadFormValues): ValidationResult {
  const result = CreateLeadSchema.safeParse({
    nome: values.nome,
    email: values.email,
    telefone: values.telefone,
    valor_imovel:
      values.valor_imovel.trim() === "" ? NaN : Number(values.valor_imovel),
    renda_mensal:
      values.renda_mensal.trim() === "" ? NaN : Number(values.renda_mensal),
  });

  if (result.success) {
    return {
      data: result.data,
      errors: {},
    };
  }

  const errors: LeadFormErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field in empty_values &&
      errors[field as LeadFormField] === undefined
    ) {
      errors[field as LeadFormField] = issue.message;
    }
  }

  return {
    data: null,
    errors,
  };
}

export default function LeadForm({
  initial_values,
  onSubmit,
}: LeadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, set_values] = useState<LeadFormValues>({
    ...empty_values,
    ...initial_values,
  });
  const [errors, set_errors] = useState<LeadFormErrors>({});

  function handle_change(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as LeadFormField;
    const { value } = event.target;

    set_values((current_values) => ({
      ...current_values,
      [field]: value,
    }));

    set_errors((current_errors) => ({
      ...current_errors,
      [field]: undefined,
    }));
  }

  function handle_submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate_form(values);
    set_errors(validation.errors);

    if (validation.data === null) {
      return;
    }

    const lead_data = validation.data;

    startTransition(async () => {
      await onSubmit?.(lead_data);
    });
  }

  function handle_cancel() {
    router.push("/leads");
  }

  return (
    <form noValidate onSubmit={handle_submit} style={form_style}>
      <div style={field_style}>
        <label htmlFor="nome" style={label_style}>
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          onChange={handle_change}
          style={input_style}
          type="text"
          value={values.nome}
        />
        {errors.nome !== undefined && <p style={error_style}>{errors.nome}</p>}
      </div>

      <div style={field_style}>
        <label htmlFor="email" style={label_style}>
          Email
        </label>
        <input
          id="email"
          name="email"
          onChange={handle_change}
          style={input_style}
          type="email"
          value={values.email}
        />
        {errors.email !== undefined && (
          <p style={error_style}>{errors.email}</p>
        )}
      </div>

      <div style={field_style}>
        <label htmlFor="telefone" style={label_style}>
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          onChange={handle_change}
          style={input_style}
          type="tel"
          value={values.telefone}
        />
        {errors.telefone !== undefined && (
          <p style={error_style}>{errors.telefone}</p>
        )}
      </div>

      <div style={field_style}>
        <label htmlFor="valor_imovel" style={label_style}>
          Valor do imovel
        </label>
        <input
          id="valor_imovel"
          min="0"
          name="valor_imovel"
          onChange={handle_change}
          step="0.01"
          style={input_style}
          type="number"
          value={values.valor_imovel}
        />
        {errors.valor_imovel !== undefined && (
          <p style={error_style}>{errors.valor_imovel}</p>
        )}
      </div>

      <div style={field_style}>
        <label htmlFor="renda_mensal" style={label_style}>
          Renda mensal
        </label>
        <input
          id="renda_mensal"
          min="0"
          name="renda_mensal"
          onChange={handle_change}
          step="0.01"
          style={input_style}
          type="number"
          value={values.renda_mensal}
        />
        {errors.renda_mensal !== undefined && (
          <p style={error_style}>{errors.renda_mensal}</p>
        )}
      </div>

      <div style={actions_style}>
        <button disabled={isPending} style={submit_button_style} type="submit">
          {isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          onClick={handle_cancel}
          style={cancel_button_style}
          type="button"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
