import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImportModal } from '@/components/ImportModal';
import { api } from '@/lib/api/client';

vi.mock('@/lib/api/client', () => ({
  api: {
    importTransactionsBatch: vi.fn().mockResolvedValue({ success: true, importedCount: 2, totalReceived: 2 }),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ImportModal Component & Full Wizard Lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload step and handles sample CSV download', () => {
    render(<ImportModal isOpen={true} onClose={() => {}} onImportSuccess={() => {}} />);

    expect(screen.getByText('Massive Data Import Wizard')).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop your CSV or JSON file here/i)).toBeInTheDocument();

    const sampleBtn = screen.getByText('Sample CSV');
    expect(sampleBtn).toBeInTheDocument();
    fireEvent.click(sampleBtn);
  });

  it('handles JSON file upload and skips directly to preview step', async () => {
    const { container } = render(
      <ImportModal isOpen={true} onClose={() => {}} onImportSuccess={() => {}} />
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const jsonContent = JSON.stringify([
      { date: '2026-08-28', amount: 150, description: 'JSON Supermarket', type: 'expense' },
      { date: '2026-08-29', amount: 500, description: 'JSON Freelance', type: 'income' },
    ]);
    const file = new File([jsonContent], 'test_import.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/2 Valid/i)).toBeInTheDocument();
      expect(screen.getByText('JSON Supermarket')).toBeInTheDocument();
    });
  });

  it('handles CSV upload, column mapping selection, preview, and batch execution', async () => {
    const onImportSuccess = vi.fn();
    const { container } = render(
      <ImportModal isOpen={true} onClose={() => {}} onImportSuccess={onImportSuccess} />
    );

    // Step 1: Upload CSV
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const csvContent = 'Date,Description,Amount,Type\n2026-08-28,Whole Foods,120.50,Expense\n2026-08-29,Client Retainer,1500.00,Income';
    const file = new File([csvContent], 'test_import.csv', { type: 'text/csv' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Step 2: Mapping Step
    await waitFor(() => {
      expect(screen.getByText(/File: test_import.csv/i)).toBeInTheDocument();
    });

    const confirmMappingBtn = screen.getByText(/Preview Data/i);
    expect(confirmMappingBtn).toBeInTheDocument();
    fireEvent.click(confirmMappingBtn);

    // Step 3: Preview Step
    await waitFor(() => {
      expect(screen.getByText(/2 Valid/i)).toBeInTheDocument();
      expect(screen.getByText('Whole Foods')).toBeInTheDocument();
    });

    // Step 4: Execute Import
    const executeBtn = screen.getByText(/Import 2 Records Now/i);
    expect(executeBtn).toBeInTheDocument();
    fireEvent.click(executeBtn);

    await waitFor(() => {
      expect(api.importTransactionsBatch).toHaveBeenCalled();
      expect(screen.getByText('Import Completed Successfully!')).toBeInTheDocument();
      expect(onImportSuccess).toHaveBeenCalled();
    });
  });

  it('resets state when closed or cancelled', () => {
    const onClose = vi.fn();
    render(<ImportModal isOpen={true} onClose={onClose} onImportSuccess={() => {}} />);

    const closeBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
