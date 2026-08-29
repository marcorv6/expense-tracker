import { describe, it, expect } from 'vitest';
import { parseCSV, autoDetectColumns, validateAndNormalizeRows, generateSampleCSV } from '@/lib/utils/csv-parser';

describe('CSV Parser & Data Normalization Utility', () => {
  it('parses raw CSV text with quotes and escaped commas', () => {
    const rawCSV = `Date,Description,Amount,Type\n"2026-08-28","Whole Foods, Inc.",120.50,Expense\n2026-08-29,Salary,3500.00,Income`;
    const { headers, rows } = parseCSV(rawCSV);

    expect(headers).toEqual(['Date', 'Description', 'Amount', 'Type']);
    expect(rows).toHaveLength(2);
    expect(rows[0]['Description']).toBe('Whole Foods, Inc.');
    expect(rows[0]['Amount']).toBe('120.50');
  });

  it('auto-detects English and Spanish header names correctly', () => {
    const headersEs = ['Fecha', 'Concepto', 'Monto', 'Categoria', 'Metodo'];
    const mappingEs = autoDetectColumns(headersEs);

    expect(mappingEs.date).toBe('Fecha');
    expect(mappingEs.description).toBe('Concepto');
    expect(mappingEs.amount).toBe('Monto');
    expect(mappingEs.category).toBe('Categoria');
    expect(mappingEs.paymentMethod).toBe('Metodo');
  });

  it('validates dates and amounts while catching invalid rows', () => {
    const rows = [
      { Date: '2026-08-28', Amount: '150.00', Description: 'Dinner', Category: 'Dining Out' },
      { Date: 'invalid-date', Amount: '50.00', Description: 'Bad Date' },
      { Date: '2026-08-28', Amount: 'abc', Description: 'Bad Amount' },
    ];
    const mapping = {
      date: 'Date',
      amount: 'Amount',
      description: 'Description',
      category: 'Category',
      type: '',
      paymentMethod: '',
      notes: '',
    };

    const validated = validateAndNormalizeRows(rows, mapping);

    expect(validated[0].isValid).toBe(true);
    expect(validated[0].amount).toBe(150);
    expect(validated[1].isValid).toBe(false);
    expect(validated[1].errorReason).toBe('Invalid date format');
    expect(validated[2].isValid).toBe(false);
    expect(validated[2].errorReason).toBe('Invalid or zero amount');
  });

  it('generates sample CSV template string', () => {
    const sample = generateSampleCSV();
    expect(sample).toContain('Date,Description,Amount');
    expect(sample).toContain('Whole Foods Supermarket');
  });
});
