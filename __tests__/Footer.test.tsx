import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '@/components/Footer';

describe('Footer Component', () => {
  it('renders footer copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/SpendFlow/i)).toBeInTheDocument();
  });
});
