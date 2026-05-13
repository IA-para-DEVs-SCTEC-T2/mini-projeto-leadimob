"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";
import {
  CreateLeadSchema,
  type CreateLeadInput,
} from "@/schemas/lead.schema";
import { create_lead_action } from "@/app/leads/actions";

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
} {
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
  const [server_error, set_server_error] = useState<string | null>(null);

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

    set_server_error(null);
  }

  function handle_submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate_form(values);
    set_errors(validation.errors);

    if (validation.data === null) {
      return;
    }

    const form_data = new FormData();
    form_data.append("nome", values.nome);
    form_data.append("email", values.email);
    form_data.append("cpf", values.cpf);
    form_data.append("telefone", values.telefone);
    form_data.append("valor_imovel", values.valor_imovel);
    form_data.append("renda_mensal", values.renda_mensal);

    startTransition(async () => {
      const result = await create_lead_action(form_data);

      if (result.success) {
        // Redirect is handled by the Server Action
        return;
      }

      if ("errors" in result) {
        // Handle validation errors from server
        set_errors(
          Object.entries(result.errors).reduce(
            (acc, [field, messages]) => {
              acc[field as LeadFormField] = messages[0];
              return acc;
            },
            {} as LeadFormErrors,
          ),
        );
      } else if ("error" in result) {
        // Handle general server error
        set_server_error(result.error);
      }
    });
  }

  function handle_cancel() {
    router.push("/leads");
  }

  return (
    <form noValidate onSubmit={handle_submit} className="space-y-4">
      {server_error !== null && (
        <div className="rounded bg-red-600 px-4 py-2 text-sm text-red-100">
          {server_error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="nome" className="block font-semibold text-slate-100">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          onChange={handle_change}
          className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
          type="text"
          value={values.nome}
        />
        {errors.nome !== undefined && (
          <p className="text-sm text-red-400">{errors.nome}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block font-semibold text-slate-100">
          Email
        </label>
        <input
          id="email"
          name="email"
          onChange={handle_change}
          className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
          type="email"
          value={values.email}
        />
        {errors.email !== undefined && (
          <p className="text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="cpf" className="block font-semibold text-slate-100">
          CPF
        </label>
        <input
          id="cpf"
          name="cpf"
          onChange={handle_change}
          placeholder="000.000.000-00"
          className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
          type="text"
          value={values.cpf}
        />
        {errors.cpf !== undefined && (
          <p className="text-sm text-red-400">{errors.cpf}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="telefone" className="block font-semibold text-slate-100">
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          onChange={handle_change}
          className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
          type="tel"
          value={values.telefone}
        />
        {errors.telefone !== undefined && (
          <p className="text-sm text-red-400">{errors.telefone}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="valor_imovel" className="block font-semibold text-slate-100">
          Valor do imóvel
        </label>
        <input
          id="valor_imovel"
          min="0"
          name="valor_imovel"
          onChange={handle_change}
          step="0.01"
          className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
          type="number"
          value={values.valor_imovel}
        />
        {errors.valor_imovel !== undefined && (
          <p className="text-sm text-red-400">{errors.valor_imovel}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="renda_mensal" className="block font-semibold text-slate-100">
          Renda mensal
        </label>
        <input
          id="renda_mensal"
          min="0"
          name="renda_mensal"
          onChange={handle_change}
          step="0.01"
          className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
          type="number"
          value={values.renda_mensal}
        />
        {errors.renda_mensal !== undefined && (
          <p className="text-sm text-red-400">{errors.renda_mensal}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          disabled={isPending}
          className="flex-1 rounded bg-yellow-400 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-yellow-500 disabled:opacity-50"
          type="submit"
        >
          {isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          onClick={handle_cancel}
          className="flex-1 rounded border border-slate-600 bg-slate-700 px-4 py-2 font-semibold text-slate-100 transition-colors hover:bg-slate-600"
          type="button"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
