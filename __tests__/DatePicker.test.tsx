import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from '@/components/DatePicker';

describe('DatePicker Component', () => {
  it('renders display label and formatted date', () => {
    render(<DatePicker value="2026-08-28" onChange={vi.fn()} label="Transaction Date" />);

    expect(screen.getByText('Transaction Date')).toBeInTheDocument();
    expect(screen.getByText('(2026-08-28)')).toBeInTheDocument();
  });

  it('opens popover calendar on click and allows preset selection', () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-08-28" onChange={handleChange} label="Transaction Date" />);

    const trigger = screen.getByText('(2026-08-28)');
    fireEvent.click(trigger);

    const todayElements = screen.getAllByText('Today');
    expect(todayElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();

    const tomorrowBtn = screen.getByText('Tomorrow');
    fireEvent.click(tomorrowBtn);

    expect(handleChange).toHaveBeenCalled();
  });
});
