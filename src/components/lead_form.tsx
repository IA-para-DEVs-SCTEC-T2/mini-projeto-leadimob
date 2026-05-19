"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";

import { create_lead_action, update_lead_action } from "@/app/leads/actions";
import {
  format_cpf,
  format_currency,
  format_phone,
  mask_cpf,
  mask_currency,
  mask_phone,
  parse_cpf,
  parse_currency,
  parse_phone,
} from "@/lib/formatters";
import {
  type CreateLeadInput,
  CreateLeadSchema,
  type UpdateLeadInput,
  UpdateLeadSchema,
} from "@/schemas/lead.schema";
import type { Lead } from "@/types/lead";

type LeadFormField =
  | "nome"
  | "email"
  | "cpf"
  | "telefone"
  | "valor_imovel"
  | "renda_mensal";

type LeadFormValues = Record<LeadFormField, string>;
type LeadFormErrors = Partial<Record<LeadFormField, string>>;

interface LeadFormProps {
  mode?: "create" | "edit";
  lead?: Lead;
  initial_values?: Partial<LeadFormValues>;
  _onSubmit?: (data: CreateLeadInput | UpdateLeadInput) => Promise<void> | void;
}

const empty_values: LeadFormValues = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  valor_imovel: "",
  renda_mensal: "",
};

function get_initial_values_from_lead(lead?: Lead): LeadFormValues {
  if (!lead) {
    return empty_values;
  }

  return {
    nome: lead.nome,
    email: lead.email,
    cpf: format_cpf(lead.cpf),
    telefone: format_phone(lead.telefone),
    valor_imovel: format_currency(lead.valor_imovel),
    renda_mensal: format_currency(lead.renda_mensal),
  };
}

function validate_form(values: LeadFormValues, mode: "create" | "edit" = "create"): {
  data: CreateLeadInput | UpdateLeadInput | null;
  errors: LeadFormErrors;
  is_valid: boolean;
} {
  // Parse values properly before validation
  const parsed_cpf = parse_cpf(values.cpf);
  const parsed_telefone = parse_phone(values.telefone);
  const parsed_valor_imovel = parse_currency(values.valor_imovel);
  const parsed_renda_mensal = parse_currency(values.renda_mensal);

  const schema = mode === "create" ? CreateLeadSchema : UpdateLeadSchema;

  const result = schema.safeParse({
    nome: values.nome.trim(),
    email: values.email.trim(),
    cpf: parsed_cpf,
    telefone: parsed_telefone,
    valor_imovel: parsed_valor_imovel,
    renda_mensal: parsed_renda_mensal,
  });

  if (result.success) {
    return {
      data: result.data,
      errors: {},
      is_valid: true,
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
    is_valid: false,
  };
}

export default function LeadForm({
  mode = "create",
  lead,
  initial_values,
  _onSubmit,
}: LeadFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getButtonText = (): string => {
    if (isPending) {
      return mode === "edit" ? "Atualizando..." : "Salvando...";
    }
    return mode === "edit" ? "Atualizar Lead" : "Salvar Lead";
  };

  // Determine initial values based on mode and props
  const computed_initial_values = mode === "edit" && lead
    ? get_initial_values_from_lead(lead)
    : { ...empty_values, ...initial_values };

  const [values, set_values] = useState<LeadFormValues>(computed_initial_values);
  const [server_error, set_server_error] = useState<string | null>(null);

  // Compute validation state directly without effect
  const validation = validate_form(values, mode);
  const has_content = Object.values(values).some(value => value.trim() !== "");
  const is_form_valid = validation.is_valid;
  const display_errors = has_content ? validation.errors : {};

  function handle_change(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as LeadFormField;
    let { value } = event.target;

    // Apply masks based on field type
    switch (field) {
    case "cpf":
      value = mask_cpf(value);
      break;
    case "telefone":
      value = mask_phone(value);
      break;
    case "valor_imovel":
    case "renda_mensal":
      value = mask_currency(value);
      break;
    default:
      // No mask for other fields
      break;
    }

    set_values((current_values) => ({
      ...current_values,
      [field]: value,
    }));

    set_server_error(null);
  }

  function handle_submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate_form(values, mode);

    if (!validation.is_valid || validation.data === null) {
      return;
    }

    // Create FormData with parsed values
    const form_data = new FormData();
    form_data.append("nome", values.nome.trim());
    form_data.append("email", values.email.trim());
    form_data.append("cpf", parse_cpf(values.cpf));
    form_data.append("telefone", parse_phone(values.telefone));
    form_data.append("valor_imovel", parse_currency(values.valor_imovel).toString());
    form_data.append("renda_mensal", parse_currency(values.renda_mensal).toString());

    startTransition(async () => {
      let result;

      if (mode === "edit" && lead) {
        result = await update_lead_action(lead.id, form_data);
      } else {
        result = await create_lead_action(form_data);
      }

      if (result.success) {
        // Redirect is handled by the Server Action
        return;
      }

      if ("errors" in result) {
        // Handle validation errors from server (including CPF already exists)
        // Note: Server errors are displayed via display_errors computed state
        set_server_error(null);
      } else if ("error" in result) {
        // Handle general server error
        set_server_error(result.error);
      }
    });
  }

  function handle_cancel() {
    if (mode === "edit" && lead) {
      router.push(`/leads/${lead.id}`);
    } else {
      router.push("/leads");
    }
  }

  return (
    <div className="space-y-6">
      {server_error !== null && (
        <div className="rounded bg-red-600 px-4 py-2 text-sm text-red-100">
          {server_error}
        </div>
      )}

      <form noValidate onSubmit={handle_submit} className="space-y-6">
        {/* Dados Pessoais Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-400">DADOS PESSOAIS</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-medium text-slate-100">
                Nome Completo *
              </label>
              <input
                id="nome"
                name="nome"
                onChange={handle_change}
                placeholder="Ex: João da Silva"
                className={`w-full rounded border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none ${
                  display_errors.nome
                    ? "border-red-500 bg-red-900/20 focus:border-red-400"
                    : "border-slate-600 bg-slate-700 focus:border-yellow-400"
                }`}
                type="text"
                value={values.nome}
              />
              {display_errors.nome !== undefined && (
                <p className="text-sm text-red-400">{display_errors.nome}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-100">
                E-mail *
              </label>
              <input
                id="email"
                name="email"
                onChange={handle_change}
                placeholder="Ex: joao.silva@email.com"
                className={`w-full rounded border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none ${
                  display_errors.email
                    ? "border-red-500 bg-red-900/20 focus:border-red-400"
                    : "border-slate-600 bg-slate-700 focus:border-yellow-400"
                }`}
                type="email"
                value={values.email}
              />
              {display_errors.email !== undefined && (
                <p className="text-sm text-red-400">{display_errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="telefone" className="block text-sm font-medium text-slate-100">
                Telefone *
              </label>
              <input
                id="telefone"
                name="telefone"
                onChange={handle_change}
                placeholder="(11) 98765-4321"
                className={`w-full rounded border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none ${
                  display_errors.telefone
                    ? "border-red-500 bg-red-900/20 focus:border-red-400"
                    : "border-slate-600 bg-slate-700 focus:border-yellow-400"
                }`}
                type="tel"
                value={values.telefone}
              />
              {display_errors.telefone !== undefined && (
                <p className="text-sm text-red-400">{display_errors.telefone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="cpf" className="block text-sm font-medium text-slate-100">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                onChange={handle_change}
                placeholder="000.000.000-00"
                className={`w-full rounded border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none ${
                  display_errors.cpf
                    ? "border-red-500 bg-red-900/20 focus:border-red-400"
                    : "border-slate-600 bg-slate-700 focus:border-yellow-400"
                }`}
                type="text"
                value={values.cpf}
              />
              {display_errors.cpf !== undefined && (
                <p className="text-sm text-red-400">{display_errors.cpf}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dados Financeiros Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-400">DADOS FINANCEIROS</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="renda_mensal" className="block text-sm font-medium text-slate-100">
                Renda Mensal *
              </label>
              <input
                id="renda_mensal"
                name="renda_mensal"
                onChange={handle_change}
                placeholder="R$ 0,00"
                className={`w-full rounded border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none ${
                  display_errors.renda_mensal
                    ? "border-red-500 bg-red-900/20 focus:border-red-400"
                    : "border-slate-600 bg-slate-700 focus:border-yellow-400"
                }`}
                type="text"
                value={values.renda_mensal}
              />
              {display_errors.renda_mensal !== undefined && (
                <p className="text-sm text-red-400">{display_errors.renda_mensal}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="valor_imovel" className="block text-sm font-medium text-slate-100">
                Valor do Imóvel de Interesse *
              </label>
              <input
                id="valor_imovel"
                name="valor_imovel"
                onChange={handle_change}
                placeholder="R$ 0,00"
                className={`w-full rounded border px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none ${
                  display_errors.valor_imovel
                    ? "border-red-500 bg-red-900/20 focus:border-red-400"
                    : "border-slate-600 bg-slate-700 focus:border-yellow-400"
                }`}
                type="text"
                value={values.valor_imovel}
              />
              {display_errors.valor_imovel !== undefined && (
                <p className="text-sm text-red-400">{display_errors.valor_imovel}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handle_cancel}
            className="flex-1 rounded border border-slate-600 bg-slate-700 px-4 py-2 font-semibold text-slate-100 transition-colors hover:bg-slate-600"
            type="button"
          >
            Cancelar
          </button>
          <button
            disabled={isPending || !is_form_valid}
            className={`flex-1 rounded px-4 py-2 font-semibold transition-colors ${
              isPending || !is_form_valid
                ? "cursor-not-allowed bg-slate-600 text-slate-400"
                : "bg-yellow-400 text-slate-900 hover:bg-yellow-500"
            }`}
            type="submit"
          >
            {getButtonText()}
          </button>
        </div>
      </form>
    </div>
  );
}