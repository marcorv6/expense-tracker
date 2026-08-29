'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  parseCSV,
  autoDetectColumns,
  validateAndNormalizeRows,
  generateSampleCSV,
  ColumnMapping,
  ValidatedImportRecord,
  CSVRawRow,
} from '@/lib/utils/csv-parser';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

type WizardStep = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete';

export function ImportModal({ isOpen, onClose, onImportSuccess }: ImportModalProps) {
  const [step, setStep] = useState<WizardStep>('upload');
  const [fileName, setFileName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<CSVRawRow[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    date: '',
    amount: '',
    description: '',
    category: '',
    type: '',
    paymentMethod: '',
    notes: '',
  });
  const [validatedRecords, setValidatedRecords] = useState<ValidatedImportRecord[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{ imported: number; total: number } | null>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setStep('upload');
    setFileName('');
    setHeaders([]);
    setRawRows([]);
    setValidatedRecords([]);
    setImportSummary(null);
    setIsImporting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spendflow_sample_import.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sample CSV template downloaded!');
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const jsonItems = JSON.parse(text);
          if (Array.isArray(jsonItems)) {
            const records: ValidatedImportRecord[] = jsonItems.map((item: Record<string, unknown>, idx: number) => ({
              date: typeof item.date === 'string' ? item.date : new Date().toISOString().slice(0, 10),
              amount: Math.abs(typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount || 0)) || 0),
              description: typeof item.description === 'string' ? item.description : `JSON Item ${idx + 1}`,
              categoryName: typeof item.categoryName === 'string' ? item.categoryName : (typeof item.category === 'string' ? item.category : 'General'),
              type: item.type === 'income' ? 'income' : 'expense',
              paymentMethod: typeof item.paymentMethod === 'string' ? item.paymentMethod : 'credit_card',
              notes: typeof item.notes === 'string' ? item.notes : '',
              isValid: !!(item.amount && item.description),
            }));
            setValidatedRecords(records);
            setStep('preview');
          } else {
            toast.error('JSON file must contain an array of transaction records.');
          }
        } catch {
          toast.error('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const { headers: parsedHeaders, rows: parsedRows } = parseCSV(text);

        if (parsedHeaders.length === 0 || parsedRows.length === 0) {
          toast.error('CSV file appears to be empty or unreadable.');
          return;
        }

        setHeaders(parsedHeaders);
        setRawRows(parsedRows);

        const detected = autoDetectColumns(parsedHeaders);
        setMapping(detected);
        setStep('mapping');
      };
      reader.readAsText(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmMapping = () => {
    if (!mapping.date || !mapping.amount || !mapping.description) {
      toast.error('Please map Date, Amount, and Description fields.');
      return;
    }

    const validated = validateAndNormalizeRows(rawRows, mapping);
    setValidatedRecords(validated);
    setStep('preview');
  };

  const handleExecuteImport = async () => {
    const validItems = validatedRecords.filter((r) => r.isValid);
    if (validItems.length === 0) {
      toast.error('No valid records found to import.');
      return;
    }

    setIsImporting(true);
    setStep('importing');

    try {
      const res = await api.importTransactionsBatch(validItems);
      setImportSummary({
        imported: res.importedCount,
        total: validItems.length,
      });
      setStep('complete');
      toast.success(`Successfully imported ${res.importedCount} transactions!`);
      onImportSuccess();
    } catch {
      toast.error('Failed to process batch import.');
      setStep('preview');
    } finally {
      setIsImporting(false);
    }
  };

  const validCount = validatedRecords.filter((r) => r.isValid).length;
  const invalidCount = validatedRecords.filter((r) => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200/80 text-cyan-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Massive Data Import Wizard</h3>
              <p className="text-[11px] font-mono text-slate-500">Bulk import transactions from CSV bank statements or JSON backups</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Steps Navigation Bar */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-500">
          <span className={step === 'upload' ? 'text-slate-900 font-extrabold' : ''}>1. Upload File</span>
          <span>→</span>
          <span className={step === 'mapping' ? 'text-slate-900 font-extrabold' : ''}>2. Column Mapping</span>
          <span>→</span>
          <span className={step === 'preview' ? 'text-slate-900 font-extrabold' : ''}>3. Preview & Validation</span>
          <span>→</span>
          <span className={step === 'complete' ? 'text-emerald-700 font-extrabold' : ''}>4. Complete</span>
        </div>

        {/* Body Steps */}
        <div className="p-6 space-y-6 flex-1">
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-3xl p-8 text-center space-y-4 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-6 h-6 text-slate-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-slate-900">Drag & drop your CSV or JSON file here</p>
                  <p className="text-xs text-slate-500 font-mono">Supports .csv, .tsv, and SpendFlow .json backup exports</p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Template Download */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Need a format template?</p>
                    <p className="text-[11px] text-slate-500 font-mono">Download sample CSV file with standard columns</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleCSV}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-slate-800 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sample CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: COLUMN MAPPING */}
          {step === 'mapping' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 text-cyan-900 text-xs font-mono space-y-1">
                <p className="font-bold">File: {fileName}</p>
                <p className="text-[11px]">Map headers from your CSV file to SpendFlow data fields:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { field: 'date', label: 'Date (Required)', req: true },
                  { field: 'amount', label: 'Amount (Required)', req: true },
                  { field: 'description', label: 'Description (Required)', req: true },
                  { field: 'category', label: 'Category', req: false },
                  { field: 'type', label: 'Type (Expense / Income)', req: false },
                  { field: 'paymentMethod', label: 'Payment Channel', req: false },
                ].map(({ field, label }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-mono font-bold text-slate-700 block">{label}</label>
                    <select
                      value={mapping[field] || ''}
                      onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    >
                      <option value="">-- Select Header --</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMapping}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Preview Data ({rawRows.length} Rows)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & VALIDATION */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{validCount} Valid</span>
                  </span>
                  {invalidCount > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{invalidCount} Invalid (Will Skip)</span>
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-500">Total: {validatedRecords.length} records</span>
              </div>

              {/* Data Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold sticky top-0">
                    <tr>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {validatedRecords.slice(0, 50).map((r, i) => (
                      <tr key={i} className={r.isValid ? 'hover:bg-slate-50/80' : 'bg-rose-50/50'}>
                        <td className="p-2.5">
                          {r.isValid ? (
                            <span className="text-emerald-600 font-bold">✓ Valid</span>
                          ) : (
                            <span className="text-rose-600 font-bold">⚠ {r.errorReason}</span>
                          )}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900">{r.date}</td>
                        <td className="p-2.5 text-slate-800 truncate max-w-[150px]">{r.description}</td>
                        <td className="p-2.5 font-bold text-slate-900 tabular-nums">${r.amount.toFixed(2)}</td>
                        <td className="p-2.5 capitalize">{r.type}</td>
                        <td className="p-2.5">{r.categoryName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Start Over
                </button>
                <button
                  type="button"
                  disabled={validCount === 0 || isImporting}
                  onClick={handleExecuteImport}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Import {validCount} Records Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: IMPORTING PROGRESS */}
          {step === 'importing' && (
            <div className="p-8 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-cyan-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900">Importing Transactions...</h4>
                <p className="text-xs font-mono text-slate-500">Executing batch insert and recalculating stats</p>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETE */}
          {step === 'complete' && importSummary && (
            <div className="p-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-extrabold text-slate-900">Import Completed Successfully!</h4>
                <p className="text-xs font-mono text-slate-600">
                  Successfully added <span className="font-bold text-slate-900">{importSummary.imported}</span> transactions to your financial ledger.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
              >
                View Updated Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
