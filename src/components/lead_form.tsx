"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition, useEffect } from "react";
import {
  CreateLeadSchema,
  type CreateLeadInput,
} from "@/schemas/lead.schema";
import { create_lead_action } from "@/app/leads/actions";
import {
  mask_cpf,
  mask_phone,
  mask_currency,
  parse_cpf,
  parse_phone,
  parse_currency,
} from "@/lib/formatters";

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
  initial_values?: Partial<LeadFormValues>;
  onSubmit?: (data: CreateLeadInput) => Promise<void> | void;
}

const empty_values: LeadFormValues = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  valor_imovel: "",
  renda_mensal: "",
};

function validate_form(values: LeadFormValues): {
  data: CreateLeadInput | null;
  errors: LeadFormErrors;
  is_valid: boolean;
} {
  // Parse values properly before validation
  const parsed_cpf = parse_cpf(values.cpf);
  const parsed_telefone = parse_phone(values.telefone);
  const parsed_valor_imovel = parse_currency(values.valor_imovel);
  const parsed_renda_mensal = parse_currency(values.renda_mensal);

  const result = CreateLeadSchema.safeParse({
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
  const [server_error, set_server_error] = useState<string | null>(null);
  const [is_form_valid, set_is_form_valid] = useState(false);

  // Validate form whenever values change
  useEffect(() => {
    const validation = validate_form(values);
    set_is_form_valid(validation.is_valid);
    
    // Only show errors after user has interacted with fields
    const has_content = Object.values(values).some(value => value.trim() !== "");
    if (has_content) {
      set_errors(validation.errors);
    }
  }, [values]);

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

    const validation = validate_form(values);
    set_errors(validation.errors);

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
      const result = await create_lead_action(form_data);

      if (result.success) {
        // Redirect is handled by the Server Action
        return;
      }

      if ("errors" in result) {
        // Handle validation errors from server (including CPF already exists)
        set_errors(
          Object.entries(result.errors).reduce(
            (acc, [field, messages]) => {
              acc[field as LeadFormField] = messages[0];
              return acc;
            },
            {} as LeadFormErrors,
          ),
        );
        // Clear server error when we have field-specific errors
        set_server_error(null);
      } else if ("error" in result) {
        // Handle general server error
        set_server_error(result.error);
        // Clear field errors when we have a general error
        set_errors({});
      }
    });
  }

  function handle_cancel() {
    router.push("/leads");
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
                  errors.nome 
                    ? 'border-red-500 bg-red-900/20 focus:border-red-400' 
                    : 'border-slate-600 bg-slate-700 focus:border-yellow-400'
                }`}
                type="text"
                value={values.nome}
              />
              {errors.nome !== undefined && (
                <p className="text-sm text-red-400">{errors.nome}</p>
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
                  errors.email 
                    ? 'border-red-500 bg-red-900/20 focus:border-red-400' 
                    : 'border-slate-600 bg-slate-700 focus:border-yellow-400'
                }`}
                type="email"
                value={values.email}
              />
              {errors.email !== undefined && (
                <p className="text-sm text-red-400">{errors.email}</p>
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
                  errors.telefone 
                    ? 'border-red-500 bg-red-900/20 focus:border-red-400' 
                    : 'border-slate-600 bg-slate-700 focus:border-yellow-400'
                }`}
                type="tel"
                value={values.telefone}
              />
              {errors.telefone !== undefined && (
                <p className="text-sm text-red-400">{errors.telefone}</p>
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
                  errors.cpf 
                    ? 'border-red-500 bg-red-900/20 focus:border-red-400' 
                    : 'border-slate-600 bg-slate-700 focus:border-yellow-400'
                }`}
                type="text"
                value={values.cpf}
              />
              {errors.cpf !== undefined && (
                <p className="text-sm text-red-400">{errors.cpf}</p>
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
                  errors.renda_mensal 
                    ? 'border-red-500 bg-red-900/20 focus:border-red-400' 
                    : 'border-slate-600 bg-slate-700 focus:border-yellow-400'
                }`}
                type="text"
                value={values.renda_mensal}
              />
              {errors.renda_mensal !== undefined && (
                <p className="text-sm text-red-400">{errors.renda_mensal}</p>
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
                  errors.valor_imovel 
                    ? 'border-red-500 bg-red-900/20 focus:border-red-400' 
                    : 'border-slate-600 bg-slate-700 focus:border-yellow-400'
                }`}
                type="text"
                value={values.valor_imovel}
              />
              {errors.valor_imovel !== undefined && (
                <p className="text-sm text-red-400">{errors.valor_imovel}</p>
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
                ? 'cursor-not-allowed bg-slate-600 text-slate-400'
                : 'bg-yellow-400 text-slate-900 hover:bg-yellow-500'
            }`}
            type="submit"
          >
            {isPending ? "Salvando..." : "Salvar Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}