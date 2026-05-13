/**
 * Formata um valor numérico como moeda brasileira.
 * Exemplo: 400000 → "R$ 400.000,00"
 */
export const format_currency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata o score/índice com 2 casas decimais.
 * Retorna "—" se o valor for null ou undefined.
 * Exemplo: 90.5 → "90,50" | null → "—"
 */
export const format_score = (value: number | null): string => {
  if (value === null || value === undefined) return '—'

  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Formata uma data no padrão brasileiro DD/MM/AAAA HH:MM.
 * Exemplo: new Date('2024-01-15T14:30:00') → "15/01/2024 14:30"
 */
export const format_date = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

/**
 * Formata um CPF no padrão brasileiro XXX.XXX.XXX-XX.
 * Aceita CPF com ou sem formatação e retorna sempre formatado.
 * Exemplo: "12345678901" → "123.456.789-01" | "123.456.789-01" → "123.456.789-01"
 */
export const format_cpf = (cpf: string): string => {
  // Remove caracteres não numéricos
  const clean_cpf = cpf.replace(/\D/g, '')

  // Valida se tem 11 dígitos
  if (clean_cpf.length !== 11) {
    return cpf // Retorna original se inválido
  }

  // Formata como XXX.XXX.XXX-XX
  return clean_cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
