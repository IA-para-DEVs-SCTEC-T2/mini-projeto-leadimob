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

/**
 * Valida CPF usando o algoritmo oficial dos dígitos verificadores.
 * Rejeita CPFs com todos os dígitos iguais e valida os dígitos verificadores.
 * 
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF for válido, false caso contrário
 */
export const validate_cpf = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const clean_cpf = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (clean_cpf.length !== 11) {
    return false
  }
  
  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(clean_cpf)) {
    return false
  }
  
  // Converte para array de números
  const digits = clean_cpf.split('').map(Number)
  
  // Calcula o primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i)
  }
  let remainder = sum % 11
  const first_digit = remainder < 2 ? 0 : 11 - remainder
  
  // Verifica o primeiro dígito
  if (digits[9] !== first_digit) {
    return false
  }
  
  // Calcula o segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i)
  }
  remainder = sum % 11
  const second_digit = remainder < 2 ? 0 : 11 - remainder
  
  // Verifica o segundo dígito
  return digits[10] === second_digit
}

/**
 * Aplica máscara de CPF em tempo real durante a digitação.
 * Remove caracteres não numéricos e aplica formatação progressiva.
 * Exemplo: "123456789" → "123.456.789"
 */
export const mask_cpf = (value: string): string => {
  // Remove caracteres não numéricos
  const clean_value = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos
  const limited_value = clean_value.slice(0, 11)
  
  // Aplica formatação progressiva
  if (limited_value.length <= 3) {
    return limited_value
  } else if (limited_value.length <= 6) {
    return limited_value.replace(/(\d{3})(\d+)/, '$1.$2')
  } else if (limited_value.length <= 9) {
    return limited_value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  } else {
    return limited_value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
  }
}

/**
 * Aplica máscara de telefone em tempo real durante a digitação.
 * Detecta automaticamente formato celular (9 dígitos) ou fixo (8 dígitos).
 * Exemplo: "11987654321" → "(11) 98765-4321"
 */
export const mask_phone = (value: string): string => {
  // Remove caracteres não numéricos
  const clean_value = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos (DDD + 9 dígitos do celular)
  const limited_value = clean_value.slice(0, 11)
  
  // Aplica formatação progressiva
  if (limited_value.length <= 2) {
    return limited_value
  } else if (limited_value.length <= 6) {
    return limited_value.replace(/(\d{2})(\d+)/, '($1) $2')
  } else if (limited_value.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return limited_value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
  } else {
    // Celular: (XX) XXXXX-XXXX
    return limited_value.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3')
  }
}

/**
 * Aplica máscara monetária brasileira em tempo real durante a digitação.
 * Converte centavos para formato R$ X.XXX,XX
 * Exemplo: "123456" → "R$ 1.234,56"
 */
export const mask_currency = (value: string): string => {
  // Remove caracteres não numéricos
  const clean_value = value.replace(/\D/g, '')
  
  if (clean_value === '') {
    return ''
  }
  
  // Converte para número (em centavos)
  const number_value = parseInt(clean_value, 10)
  
  // Converte centavos para reais
  const real_value = number_value / 100
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(real_value)
}

/**
 * Remove formatação monetária e retorna o valor numérico.
 * Exemplo: "R$ 1.234,56" → 1234.56
 */
export const parse_currency = (value: string): number => {
  if (!value || value.trim() === '') {
    return 0
  }
  
  // Remove tudo exceto dígitos e vírgula
  const clean_value = value.replace(/[^\d,]/g, '')
  
  if (clean_value === '') {
    return 0
  }
  
  // Se não tem vírgula, trata como centavos (valor digitado sem formatação)
  if (!clean_value.includes(',')) {
    const number_value = parseInt(clean_value, 10)
    return isNaN(number_value) ? 0 : number_value / 100
  }
  
  // Se tem vírgula, substitui por ponto para conversão
  const normalized_value = clean_value.replace(',', '.')
  const parsed_value = parseFloat(normalized_value)
  
  return isNaN(parsed_value) ? 0 : parsed_value
}

/**
 * Remove formatação de CPF e retorna apenas os dígitos.
 * Exemplo: "123.456.789-01" → "12345678901"
 */
export const parse_cpf = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Remove formatação de telefone e retorna apenas os dígitos.
 * Exemplo: "(11) 98765-4321" → "11987654321"
 */
export const parse_phone = (value: string): string => {
  return value.replace(/\D/g, '')
}
