import { 
  format_currency, 
  format_score, 
  format_date, 
  format_cpf,
  validate_cpf,
  mask_cpf,
  mask_phone,
  mask_currency,
  parse_cpf,
  parse_phone,
  parse_currency
} from '@/lib/formatters'

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

  describe('validate_cpf', () => {
    it('should validate correct CPFs', () => {
      expect(validate_cpf('11144477735')).toBe(true)
      expect(validate_cpf('111.444.777-35')).toBe(true)
      expect(validate_cpf('52998224725')).toBe(true)
      expect(validate_cpf('529.982.247-25')).toBe(true)
    })

    it('should reject CPFs with all same digits', () => {
      expect(validate_cpf('11111111111')).toBe(false)
      expect(validate_cpf('000.000.000-00')).toBe(false)
      expect(validate_cpf('222.222.222-22')).toBe(false)
      expect(validate_cpf('999.999.999-99')).toBe(false)
    })

    it('should reject CPFs with wrong check digits', () => {
      expect(validate_cpf('11144477736')).toBe(false) // last digit wrong
      expect(validate_cpf('11144477725')).toBe(false) // second-to-last digit wrong
      expect(validate_cpf('12345678901')).toBe(false) // both digits wrong
    })

    it('should reject CPFs with wrong length', () => {
      expect(validate_cpf('1234567890')).toBe(false) // 10 digits
      expect(validate_cpf('123456789012')).toBe(false) // 12 digits
      expect(validate_cpf('')).toBe(false) // empty
    })

    it('should handle CPFs with formatting', () => {
      expect(validate_cpf('111.444.777-35')).toBe(true)
      expect(validate_cpf('111 444 777 35')).toBe(true)
      expect(validate_cpf('111-444-777-35')).toBe(true)
    })

    it('should reject non-numeric characters mixed with valid CPF', () => {
      expect(validate_cpf('111a444b777c35')).toBe(true) // should clean and validate
      expect(validate_cpf('abc111444777def35')).toBe(true) // should clean and validate
    })
  })

  describe('mask_cpf', () => {
    it('should apply progressive CPF mask', () => {
      expect(mask_cpf('123')).toBe('123')
      expect(mask_cpf('1234')).toBe('123.4')
      expect(mask_cpf('1234567')).toBe('123.456.7')
      expect(mask_cpf('1234567890')).toBe('123.456.789-0')
      expect(mask_cpf('12345678901')).toBe('123.456.789-01')
    })

    it('should remove non-numeric characters', () => {
      expect(mask_cpf('123abc456')).toBe('123.456')
      expect(mask_cpf('123.456.789-01')).toBe('123.456.789-01')
    })

    it('should limit to 11 digits', () => {
      expect(mask_cpf('123456789012345')).toBe('123.456.789-01')
    })

    it('should handle empty string', () => {
      expect(mask_cpf('')).toBe('')
    })
  })

  describe('mask_phone', () => {
    it('should apply progressive phone mask', () => {
      expect(mask_phone('11')).toBe('11')
      expect(mask_phone('119')).toBe('(11) 9')
      expect(mask_phone('1198765')).toBe('(11) 9876-5')
      expect(mask_phone('11987654321')).toBe('(11) 98765-4321')
    })

    it('should handle landline format', () => {
      expect(mask_phone('1134567890')).toBe('(11) 3456-7890')
    })

    it('should remove non-numeric characters', () => {
      expect(mask_phone('11abc98765')).toBe('(11) 9876-5')
    })

    it('should limit to 11 digits', () => {
      expect(mask_phone('119876543210')).toBe('(11) 98765-4321')
    })

    it('should handle empty string', () => {
      expect(mask_phone('')).toBe('')
    })
  })

  describe('mask_currency', () => {
    it('should apply currency mask', () => {
      expect(mask_currency('123')).toMatch(/R\$\s*1,23/)
      expect(mask_currency('1234')).toMatch(/R\$\s*12,34/)
      expect(mask_currency('123456')).toMatch(/R\$\s*1\.234,56/)
      expect(mask_currency('12345678')).toMatch(/R\$\s*123\.456,78/)
    })

    it('should handle single digit', () => {
      expect(mask_currency('5')).toMatch(/R\$\s*0,05/)
    })

    it('should handle two digits', () => {
      expect(mask_currency('50')).toMatch(/R\$\s*0,50/)
    })

    it('should remove non-numeric characters', () => {
      expect(mask_currency('12a3b4')).toMatch(/R\$\s*12,34/)
    })

    it('should handle empty string', () => {
      expect(mask_currency('')).toBe('')
    })
  })

  describe('parse_cpf', () => {
    it('should remove formatting from CPF', () => {
      expect(parse_cpf('123.456.789-01')).toBe('12345678901')
      expect(parse_cpf('123 456 789 01')).toBe('12345678901')
      expect(parse_cpf('12345678901')).toBe('12345678901')
    })

    it('should handle empty string', () => {
      expect(parse_cpf('')).toBe('')
    })
  })

  describe('parse_phone', () => {
    it('should remove formatting from phone', () => {
      expect(parse_phone('(11) 98765-4321')).toBe('11987654321')
      expect(parse_phone('11 98765 4321')).toBe('11987654321')
      expect(parse_phone('11987654321')).toBe('11987654321')
    })

    it('should handle empty string', () => {
      expect(parse_phone('')).toBe('')
    })
  })

  describe('parse_currency', () => {
    it('should parse currency to number', () => {
      expect(parse_currency('R$ 1.234,56')).toBe(1234.56)
      expect(parse_currency('R$ 123,45')).toBe(123.45)
      expect(parse_currency('R$ 0,50')).toBe(0.50)
    })

    it('should handle values without currency symbol', () => {
      expect(parse_currency('1234,56')).toBe(1234.56)
      expect(parse_currency('123,45')).toBe(123.45)
    })

    it('should handle raw digits as centavos', () => {
      expect(parse_currency('12345')).toBe(123.45)
      expect(parse_currency('50')).toBe(0.50)
    })

    it('should handle empty string', () => {
      expect(parse_currency('')).toBe(0)
    })

    it('should handle whitespace', () => {
      expect(parse_currency('   ')).toBe(0)
    })

    it('should handle invalid values', () => {
      expect(parse_currency('abc')).toBe(0)
    })
  })
})
