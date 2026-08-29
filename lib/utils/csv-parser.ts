export interface CSVRawRow {
  [key: string]: string;
}

export interface ColumnMapping {
  [key: string]: string;
  date: string;
  amount: string;
  description: string;
  category: string;
  type: string;
  paymentMethod: string;
  notes: string;
}

export interface ValidatedImportRecord {
  date: string;
  amount: number;
  description: string;
  categoryName: string;
  type: 'expense' | 'income';
  paymentMethod: string;
  notes: string;
  isValid: boolean;
  errorReason?: string;
}

/**
 * Robust RFC 4180 compliant CSV parser that handles quoted strings and line breaks.
 */
export function parseCSV(csvText: string): { headers: string[]; rows: CSVRawRow[] } {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if ((char === ',' || char === ';') && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in \r\n
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].map((h) => h.replace(/^["']|["']$/g, '').trim());
  const rows: CSVRawRow[] = [];

  for (let r = 1; r < lines.length; r++) {
    const line = lines[r];
    const rowObj: CSVRawRow = {};
    headers.forEach((header, idx) => {
      rowObj[header] = line[idx] ? line[idx].replace(/^["']|["']$/g, '').trim() : '';
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

/**
 * Smart header detection dictionary for matching user CSV columns to SpendFlow schema.
 */
export function autoDetectColumns(headers: string[]): ColumnMapping {
  const lowerHeaders = headers.map((h) => h.toLowerCase());

  const findMatch = (candidates: string[]): string => {
    for (const cand of candidates) {
      const idx = lowerHeaders.findIndex((h) => h === cand || h.includes(cand));
      if (idx !== -1) return headers[idx];
    }
    return '';
  };

  return {
    date: findMatch(['date', 'fecha', 'transaction_date', 'posted_date', 'day']),
    amount: findMatch(['amount', 'monto', 'valor', 'value', 'price', 'total', 'sum']),
    description: findMatch(['description', 'descripcion', 'concepto', 'merchant', 'payee', 'memo', 'details', 'name']),
    category: findMatch(['category', 'categoria', 'rubro', 'type_category', 'tag']),
    type: findMatch(['type', 'tipo', 'transaction_type', 'expense_income', 'flow']),
    paymentMethod: findMatch(['payment', 'pago', 'channel', 'method', 'metodo', 'account', 'cuenta']),
    notes: findMatch(['notes', 'notas', 'comments', 'comentarios', 'extra']),
  };
}

/**
 * Validates and normalizes raw CSV rows into SpendFlow import records.
 */
export function validateAndNormalizeRows(
  rows: CSVRawRow[],
  mapping: ColumnMapping
): ValidatedImportRecord[] {
  return rows.map((row, idx) => {
    const rawDate = row[mapping.date] || '';
    const rawAmount = row[mapping.amount] || '';
    const rawDesc = row[mapping.description] || '';
    const rawCat = row[mapping.category] || 'General';
    const rawType = row[mapping.type] || '';
    const rawPayment = row[mapping.paymentMethod] || 'credit_card';
    const rawNotes = row[mapping.notes] || '';

    // Date normalization (YYYY-MM-DD or MM/DD/YYYY or DD/MM/YYYY)
    let parsedDate = '';
    if (rawDate) {
      const dateObj = new Date(rawDate);
      if (!isNaN(dateObj.getTime())) {
        parsedDate = dateObj.toISOString().slice(0, 10);
      }
    }

    if (!parsedDate) {
      return {
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        description: rawDesc || `Row ${idx + 1}`,
        categoryName: rawCat,
        type: 'expense',
        paymentMethod: 'credit_card',
        notes: rawNotes,
        isValid: false,
        errorReason: 'Invalid date format',
      };
    }

    // Amount normalization
    const cleanAmountStr = rawAmount.replace(/[^0-9.-]/g, '');
    const numAmount = parseFloat(cleanAmountStr);

    if (isNaN(numAmount) || numAmount === 0) {
      return {
        date: parsedDate,
        amount: 0,
        description: rawDesc || `Row ${idx + 1}`,
        categoryName: rawCat,
        type: 'expense',
        paymentMethod: 'credit_card',
        notes: rawNotes,
        isValid: false,
        errorReason: 'Invalid or zero amount',
      };
    }

    // Type detection (Expense vs Income)
    let inferredType: 'expense' | 'income' = 'expense';
    const lowerType = rawType.toLowerCase();
    if (lowerType.includes('income') || lowerType.includes('ingreso') || lowerType.includes('credit') || numAmount > 0 && lowerType === 'income') {
      inferredType = 'income';
    } else if (cleanAmountStr.startsWith('-')) {
      inferredType = 'expense';
    }

    const absoluteAmount = Math.abs(numAmount);

    return {
      date: parsedDate,
      amount: absoluteAmount,
      description: rawDesc || `Imported Item ${idx + 1}`,
      categoryName: rawCat || 'General',
      type: inferredType,
      paymentMethod: rawPayment || 'credit_card',
      notes: rawNotes,
      isValid: true,
    };
  });
}

/**
 * Generates sample CSV template for user download.
 */
export function generateSampleCSV(): string {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Payment Channel', 'Notes'];
  const sampleRows = [
    ['2026-08-20', 'Whole Foods Supermarket', '142.50', 'Expense', 'Dining Out', 'Credit Card', 'Weekly grocery run'],
    ['2026-08-22', 'Freelance Web Design Retainer', '1250.00', 'Income', 'Freelance', 'Bank Transfer', 'August client invoice'],
    ['2026-08-25', 'Monthly Electricity Utility', '85.20', 'Expense', 'Utilities', 'Debit Card', 'Power bill'],
    ['2026-09-05', 'Future Software Subscription', '49.00', 'Expense', 'General', 'Credit Card', 'Auto-pending transaction'],
  ];

  return [headers.join(','), ...sampleRows.map((r) => r.map((f) => `"${f}"`).join(','))].join('\n');
}
