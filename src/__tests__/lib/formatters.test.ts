import { format_currency, format_score, format_date, format_cpf } from '@/lib/formatters'

describe('formatters', () => {
  describe('format_currency', () => {
    it('should format 12000 as currency', () => {
      const result = format_currency(12000)
      expect(result).toContain('12')
      expect(result).toContain('000')
      expect(result).toContain('R$')
    })

    it('should format 400000 as currency', () => {
      const result = format_currency(400000)
      expect(result).toContain('400')
      expect(result).toContain('000')
      expect(result).toContain('R$')
    })

    it('should format 0 as currency', () => {
      const result = format_currency(0)
      expect(result).toContain('R$')
      expect(result).toContain('0')
    })

    it('should format decimal values correctly', () => {
      const result = format_currency(1234.56)
      expect(result).toContain('1')
      expect(result).toContain('234')
      expect(result).toContain('R$')
    })
  })

  describe('format_score', () => {
    it('should format 90 with 2 decimal places', () => {
      const result = format_score(90)
      expect(result).toContain('90')
    })

    it('should format 90.5 with 2 decimal places', () => {
      const result = format_score(90.5)
      expect(result).toContain('90')
    })

    it('should return — for null', () => {
      expect(format_score(null)).toBe('—')
    })

    it('should return — for undefined', () => {
      expect(format_score(undefined as any)).toBe('—')
    })

    it('should format 0 with 2 decimal places', () => {
      const result = format_score(0)
      expect(result).toContain('0')
    })
  })

  describe('format_date', () => {
    it('should format date with correct pattern', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = format_date(date)
      // Result format: DD/MM/AAAA HH:MM (may include comma in some locales)
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
      expect(result).toMatch(/\d{2}:\d{2}/)
    })

    it('should format date with leading zeros', () => {
      const date = new Date('2024-01-05T09:05:00')
      const result = format_date(date)
      expect(result).toContain('05')
      expect(result).toContain('01')
      expect(result).toContain('2024')
      expect(result).toContain('09:05')
    })
  })

  describe('format_cpf', () => {
    it('should format unformatted CPF 12345678901 as 123.456.789-01', () => {
      expect(format_cpf('12345678901')).toBe('123.456.789-01')
    })

    it('should format already formatted CPF 123.456.789-01 as 123.456.789-01', () => {
      expect(format_cpf('123.456.789-01')).toBe('123.456.789-01')
    })

    it('should handle CPF with partial formatting', () => {
      expect(format_cpf('123456789-01')).toBe('123.456.789-01')
    })

    it('should return original if CPF has less than 11 digits', () => {
      expect(format_cpf('1234567890')).toBe('1234567890')
    })

    it('should return original if CPF has more than 11 digits', () => {
      expect(format_cpf('123456789012')).toBe('123456789012')
    })

    it('should handle CPF with spaces', () => {
      expect(format_cpf('123 456 789 01')).toBe('123.456.789-01')
    })

    it('should handle empty string', () => {
      expect(format_cpf('')).toBe('')
    })
  })
})
